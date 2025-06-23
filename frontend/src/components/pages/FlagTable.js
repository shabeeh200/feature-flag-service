// src/FlagsPage.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Switch } from '@headlessui/react';
import { FaPlus } from 'react-icons/fa';
import FilterControls from '../components/FilterControl';
import NewFlag from '../components/NewFlagForm';

const initialAuditLog = [
  { date: '2024-06-22', message: 'Flag "beta-feature" enabled' },
  { date: '2024-06-23', message: 'Flag "social-login" disabled' },
];

const FlagsPage = () => {
  const [flags, setFlags] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [auditLog, setAuditLog] = useState(initialAuditLog);
  const [showModal, setShowModal] = useState(false);

  const handleCreated = (newFlag) => {
    setFlags((prev) => [newFlag, ...prev]);
  }
  useEffect(() => {
    // TODO: Fetch flags from backend API
    setFlags([
      { key: 'new-dashboard', description: 'Enable new dashboard layout', enabled: true, tags: ['ui', 'beta'] },
      { key: 'stripe-checkout', description: 'Activate Stripe payment', enabled: true, tags: ['payment'] },
      { key: 'social-login', description: 'Login with Google & Facebook', enabled: false, tags: ['auth'] },
    ]);
  }, []);

  const allTags = useMemo(
    () => Array.from(new Set(flags.flatMap((f) => f.tags))),
    [flags]
  );

  const filteredFlags = useMemo(
    () =>
      flags.filter((flag) => {
        const matchesSearch = flag.key.toLowerCase().includes(search.toLowerCase());
        const matchesTag = selectedTag ? flag.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
      }),
    [flags, search, selectedTag]
  );

  const toggleFlag = useCallback(
    (flagKey) => {
      setFlags((prev) =>
        prev.map((f) => (f.key === flagKey ? { ...f, enabled: !f.enabled } : f))
      );
      const date = new Date().toISOString().split('T')[0];
      setAuditLog((prev) => [
        { date, message: `Flag "${flagKey}" ${prev.find((f) => f.key === flagKey).enabled ? 'disabled' : 'enabled'}` },
        ...prev,
      ]);
      // TODO: Call backend PATCH API
    },
    [flags]
  );

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Feature Flags</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-600 text-white font-semibold rounded shadow"        onClick={() => setShowModal(true)}>
          <FaPlus /> Create Flag
          
        </button>
      </header>

      <FilterControls
        search={search}
        setSearch={setSearch}
        tags={allTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white- text-black text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Flag</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Tags</th>
              <th className="px-6 py-3">Enabled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFlags.map(({ key, description, tags, enabled }) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{key}</td>
                <td className="px-6 py-4 text-black">{description}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-black rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Switch
                    checked={enabled}
                    onChange={() => toggleFlag(key)}
                    className={`${enabled ? 'bg-black' : 'bg-white'} relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <NewFlag
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default FlagsPage;
