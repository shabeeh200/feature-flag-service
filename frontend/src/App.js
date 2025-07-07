// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './pages/Sidebar';
import FlagsPage from './pages/FlagTable';
import AuditPage from './pages/AuditPage';

const App = () => (
  <Router>
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<FlagsPage />} />
          <Route path="/audit" element={<AuditPage />} />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
