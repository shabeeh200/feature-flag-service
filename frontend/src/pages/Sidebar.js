// src/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaSlidersH, FaClipboardList, FaChartArea } from 'react-icons/fa';

const Sidebar = () => (
  <nav className="w-64 bg-white h-100 shadow-md border-1 border-black p-4">
    <ul className="flex flex-col p-4 space-y-4 py-3">
            <li>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
              isActive ? 'bg-gray-200 font-semibold' : ''
            }`
          }
        >
          <FaClipboardList /> Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
              isActive ? 'bg-gray-200 font-semibold' : ''
            }`
          }
        >
          <FaSlidersH /> Flags Control
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/audit"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
              isActive ? 'bg-gray-200 font-semibold' : ''
            }`
          }
        >
          <FaClipboardList /> Audit Logs
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Sidebar;
