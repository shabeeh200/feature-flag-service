// src/AuditPage.jsx
import React from 'react';

const initialAuditLog = [
  { date: '2024-06-22', message: 'Flag "beta-feature" enabled' },
  { date: '2024-06-23', message: 'Flag "social-login" disabled' },
];

const AuditPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-black">Audit Logs</h1>
    <ul className="list-disc list-inside text-black  space-y-1 bg-white rounded-xl shadow-md p-8">
      {initialAuditLog.map(({ date, message }, idx) => (
        <li key={idx}>
          <span className="font-mono text-sm text-black">{date}</span> &mdash; {message}
        </li>
      ))}
    </ul>
  </div>
);

export default AuditPage;
