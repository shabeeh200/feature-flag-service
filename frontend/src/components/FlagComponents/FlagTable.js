import React, { useMemo, useState } from 'react';
import { Switch } from '@headlessui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import FilterControls from './FilterControl';
import NewFlagForm from './NewFlagForm';

const ENV_LABELS = {
  dev: 'Development',
  staging: 'Staging',
  prod: 'Production'
};

const FlagTable = ({
  flags = [],
  loading,
  error,
  page,
  totalPages,
  onToggle,
  onDelete,
  onCreated,
  onUpdated,
  fetchFlags
}) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState(null);

  // Safe tags array and fallback
  const allTags = useMemo(
    () => Array.from(new Set((flags || []).flatMap(f => f.tags || []))),
    [flags]
  );

  // Filter flags by search and tag
  const filteredFlags = useMemo(
    () =>
      (flags || []).filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchesTag = selectedTag ? (f.tags || []).includes(selectedTag) : true;
        return matchesSearch && matchesTag;
      }),
    [flags, search, selectedTag]
  );

  const handleEditClick = (flag) => {
    setEditingFlag(flag);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingFlag(null);
  };

  if (loading) return <div className="text-center py-8">Loading flags…</div>;
  if (error) return <div className="text-center text-red-600 py-8">Failed to load flags. Please try again later.</div>;

  return (
    <>
      <div className="mb-6">
        <FilterControls
          search={search}
          setSearch={setSearch}
          tags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      </div>

      {filteredFlags.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No flags found. Create your first feature flag!
        </div>
      ) : (
        <>
          <div className="overflow-auto mt-4 bg-white shadow rounded">
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead className="bg-white uppercase text-sm">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-100">Name</th>
                  <th className="px-4 py-2 border-b border-gray-100">Description</th>
                  <th className="px-4 py-2 border-b border-gray-100">Tags</th>
                  <th className="px-4 py-2 border-b border-gray-100">Environment</th>
                  <th className="px-4 py-2 border-b border-gray-100">Enabled</th>
                  <th className="px-4 py-2 border-b border-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlags.map(f => (
                  <tr key={f._id}>
                    <td className="px-4 py-2 border-t border-gray-100">{f.name}</td>
                    <td className="px-4 py-2 border-t border-gray-100">{f.description}</td>
                    <td className="px-4 py-2 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {(f.tags || []).map(tag => (
                          <span key={tag} className="px-1 text-xs bg-gray-200 rounded">#{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 border-t border-gray-100">
                      <span className="px-2 py-1 rounded bg-gray-100 text-xs font-semibold border border-gray-300">
                        {ENV_LABELS[f.environment] || f.environment}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-t border-gray-100">
                      <Switch
                        checked={f.enabled}
                        onChange={() => onToggle(f._id)}
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
                    <td className="px-4 py-2 border-t border-gray-100">
                      <button
                        className="text-black px-4 py-2 rounded w-full md:w-auto mr-1"
                        onClick={() => onDelete(f._id)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="text-black px-4 py-2 rounded w-full md:w-auto"
                        onClick={() => handleEditClick(f)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => fetchFlags(page - 1)}
              disabled={page <= 1}
              className="px-2 py-1 border rounded"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => fetchFlags(idx + 1)}
                className={`px-2 py-1 border rounded ${page === idx + 1 ? 'bg-black text-white' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => fetchFlags(page + 1)}
              disabled={page >= totalPages}
              className="px-2 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <NewFlagForm
          initialData={editingFlag}
          onCreated={async () => {
            await onCreated();
            handleModalClose();
          }}
          onUpdated={async () => {
            await onUpdated();
            handleModalClose();
          }}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default FlagTable;
