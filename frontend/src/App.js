// src/App.jsx
import React from 'react';
import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './pages/Sidebar';
import FlagsPage from './pages/FlagControl';
import AuditPage from './pages/AuditPage';
import DashboardPage from './pages/Dashboard';
import LoadingSpinner from './components/LayoutComponents/LoadingSpinner';

const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate initial data loading (e.g., fetch dashboard data, flag data, etc.)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set this to false when real data is loaded
    }, 1500); // Simulated loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<FlagsPage />} />
            <Route path="/audit" element={<AuditPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;