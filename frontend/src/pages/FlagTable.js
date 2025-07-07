// src/pages/FlagsPage.jsx
import React, { useState, useMemo ,useEffect} from 'react';
import { Switch } from '@headlessui/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

import FilterControls from '../components/FilterControl';
import NewFlagForm from '../components/NewFlagForm';
import { useFlags } from '../hooks/useFlags';

const FlagsPage = () => {
  // ← your custom hooklt
  const {
    flags,
    loading,
    error,
    fetchFlags,
    toggleFlag,
    deleteFlag,
  } = useFlags();

  const [search, setSearch]       = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState(null);

// When “Edit” clicked:
const handleEditClick = (flag) => {
  setEditingFlag(flag);
  setShowModal(true);
};

  useEffect(() => {
    console.log('⏳ FlagsPage: calling fetchFlags()');
    fetchFlags().then(() => {
      console.log('✅ FlagsPage: fetchFlags() resolved, flags:', flags);
    });
  }, []);
  // Derive tag list once
  const allTags = useMemo(
    () => Array.from(new Set(flags.flatMap(f => f.tags))),
    [flags]
  );

  // Apply search + tag filters
  const filteredFlags = useMemo(
    () =>
      flags.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchesTag    = selectedTag ? f.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
      }),
    [flags, search, selectedTag]
  );

  // Handlers just call your hook methods
  const handleToggle = (name) => {
    toggleFlag(name);
  };

  const handleDelete = (name) => {
    deleteFlag(name);
  };

 const handleCreated = async () => {
  await fetchFlags(); // refresh flags list
  // don't call setShowModal here
};
const handleUpdated = async () => {
  await fetchFlags();
};

  if (loading) return <div>Loading flags…</div>;
  if (error)   return <div>Error loading flags.</div>;

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feature Flags</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded"
        >
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

      <div className="overflow-auto mt-4 bg-white shadow rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-100 uppercase text-sm">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Tags</th>
              <th className="px-4 py-2">Enabled</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredFlags.map(f => (
                    <tr key={f._id}>
                      <td>{f.name}</td>
                      <td>{f.description}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {f.tags.map(tag => (
                            <span key={tag} className="px-1 text-xs bg-gray-200 rounded">#{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <Switch
                          checked={f.enabled}
                          onChange={() => handleToggle(f._id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            f.enabled ? 'bg-black' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              f.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </Switch>
                      </td>
                      <td>
                        <button  className="bg-black text-white px-4 py-2 rounded w-full md:w-auto" onClick={() => handleDelete(f._id)}><FaTrash /></button>
                        <button  className="bg-black text-white px-4 py-2 rounded w-full md:w-auto" onClick={() => handleEditClick(f)} > <FaEdit/> </button>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NewFlagForm
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
      {showModal && (
      <NewFlagForm
        initialData={editingFlag}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        onClose={() => {
          setShowModal(false);
          setEditingFlag(null);
        }}
      />
      )}
    </div>
  );
};

export default FlagsPage;
