import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext(null);

const DEFAULT_SITES = [];

const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', name: 'Admin' },
];

function loadFromStorage(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AppProvider({ children }) {
  // Always require sign-in on a fresh page load/refresh (session is not persisted across reloads)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(() => loadFromStorage('bt_users', DEFAULT_USERS));
  const [sites, setSites] = useState(() => loadFromStorage('bt_sites', DEFAULT_SITES));

  const [expenses, setExpenses] = useState(() => loadFromStorage('bt_expenses', {}));
  const [workers, setWorkers] = useState(() => loadFromStorage('bt_workers', {}));
  const [attendance, setAttendance] = useState(() => loadFromStorage('bt_attendance', {}));

  useEffect(() => { saveToStorage('bt_users', users); }, [users]);
  useEffect(() => { saveToStorage('bt_sites', sites); }, [sites]);
  useEffect(() => { saveToStorage('bt_expenses', expenses); }, [expenses]);
  useEffect(() => { saveToStorage('bt_workers', workers); }, [workers]);
  useEffect(() => { saveToStorage('bt_attendance', attendance); }, [attendance]);

  const login = (username, password) => {
    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim();
    const match = users.find(usr => usr.username.toLowerCase() === u && usr.password === p);
    if (match) {
      setIsAuthenticated(true);
      setCurrentUser({ username: match.username, name: match.name });
      return true;
    }
    return false;
  };

  const signup = (name, username, password) => {
    const u = (username || '').trim();
    const p = (password || '').trim();
    const n = (name || '').trim();
    if (!u || !p || !n) return { ok: false, error: 'All fields are required.' };
    const exists = users.some(usr => usr.username.toLowerCase() === u.toLowerCase());
    if (exists) return { ok: false, error: 'That username is already taken.' };
    const newUser = { username: u, password: p, name: n };
    setUsers(prev => [...prev, newUser]);
    setIsAuthenticated(true);
    setCurrentUser({ username: newUser.username, name: newUser.name });
    return { ok: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Sites
  const createSite = (data) => {
    const site = { ...data, id: uuidv4(), createdAt: new Date().toISOString().split('T')[0], color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0') };
    setSites(prev => [...prev, site]);
    return site;
  };

  const getSite = (id) => sites.find(s => s.id === id);

  const updateSite = (id, data) => {
    setSites(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteSite = (id) => {
    setSites(prev => prev.filter(s => s.id !== id));
  };

  // Expenses
  const getSiteExpenses = (siteId) => expenses[siteId] || [];

  const addExpense = (siteId, data) => {
    const exp = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    setExpenses(prev => ({ ...prev, [siteId]: [...(prev[siteId] || []), exp] }));
  };

  const updateExpense = (siteId, id, data) => {
    setExpenses(prev => ({
      ...prev,
      [siteId]: (prev[siteId] || []).map(e => e.id === id ? { ...e, ...data } : e)
    }));
  };

  const deleteExpense = (siteId, id) => {
    setExpenses(prev => ({
      ...prev,
      [siteId]: (prev[siteId] || []).filter(e => e.id !== id)
    }));
  };

  // Workers
  const getSiteWorkers = (siteId) => workers[siteId] || [];

  const addWorker = (siteId, data) => {
    const worker = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    setWorkers(prev => ({ ...prev, [siteId]: [...(prev[siteId] || []), worker] }));
  };

  const updateWorker = (siteId, id, data) => {
    setWorkers(prev => ({
      ...prev,
      [siteId]: (prev[siteId] || []).map(w => w.id === id ? { ...w, ...data } : w)
    }));
  };

  const deleteWorker = (siteId, id) => {
    setWorkers(prev => ({
      ...prev,
      [siteId]: (prev[siteId] || []).filter(w => w.id !== id)
    }));
  };

  // Attendance
  const getWorkerAttendance = (siteId, workerId) => {
    return attendance[`${siteId}_${workerId}`] || [];
  };

  const toggleAttendance = (siteId, workerId, date) => {
    const key = `${siteId}_${workerId}`;
    setAttendance(prev => {
      const current = prev[key] || [];
      const exists = current.includes(date);
      return { ...prev, [key]: exists ? current.filter(d => d !== date) : [...current, date] };
    });
  };

  const getWorkerDaysPresent = (siteId, workerId) => {
    return (attendance[`${siteId}_${workerId}`] || []).length;
  };

  const getTotalLaborCost = useCallback((siteId) => {
    const siteWorkers = workers[siteId] || [];
    return siteWorkers.reduce((sum, w) => {
      const days = getWorkerDaysPresent(siteId, w.id);
      return sum + (w.dailyWage * days);
    }, 0);
  }, [workers, attendance]);

  const getTotalExpenses = useCallback((siteId) => {
    return (expenses[siteId] || []).reduce((s, e) => s + Number(e.amount), 0);
  }, [expenses]);

  return (
    <AppContext.Provider value={{
      isAuthenticated, currentUser, login, signup, logout,
      sites, createSite, getSite, updateSite, deleteSite,
      getSiteExpenses, addExpense, updateExpense, deleteExpense,
      getSiteWorkers, addWorker, updateWorker, deleteWorker,
      getWorkerAttendance, toggleAttendance, getWorkerDaysPresent,
      getTotalLaborCost, getTotalExpenses,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
