import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { useFlags } from '../../hooks/useFlags';
import { useUsers } from '../../hooks/useUsers';

const Dropdown = ({ options, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(opt => (opt.label || opt.value).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative mb-4 w-full max-w-xs">
      <input
        className="w-full border rounded p-2"
        onFocus={() => setOpen(true)}
        onChange={e => setSearch(e.target.value)}
        placeholder={placeholder || 'Search...'}
        value={search}
      />
      {open && (
        <ul className="absolute bg-white border rounded w-full max-h-40 overflow-y-auto z-10">
          {filtered.map(opt => (
            <li
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setSearch('');
                setOpen(false);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt.label || opt.value}
            </li>
          ))}
          {filtered.length === 0 && <li className="p-2 text-sm text-gray-500">No results</li>}
        </ul>
      )}
    </div>
  );
};

const CreateFlagForm = ({ onClose, onCreated, onUpdated, initialData }) => {
  const { createFlag, updateFlag } = useFlags();
  const { users, loading, error } = useUsers();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [tags, setTags] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rollout, setRollout] = useState(100);
  const [environment, setEnvironment] = useState('dev');
  const [alert, setAlert] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setEnabled(initialData.enabled);
      setTags((initialData.tags || []).join(','));
      setSelectedUsers(initialData.targetUsers || []);
      setRollout(initialData.rolloutPercentage ?? 100);
    }
  }, [initialData]);

  const isEdit = Boolean(initialData);

  const handleSubmit = async () => {
    if (!name.trim()) return setErrorMsg('Flag name is required');
    if (name.includes(' ')) return setErrorMsg('No spaces allowed in flag name');
    if (rollout < 0 || rollout > 100) return setErrorMsg('Rollout must be 0-100');

    const payload = {
      name: name.trim(),
      description: description.trim(),
      enabled,
      tags: tags.split(',').map(tag => tag.replace(/^#/, '').trim()).filter(Boolean),
      environment,
      targetUsers: selectedUsers,
      rolloutPercentage: rollout,
    };

    try {
      isEdit ? await updateFlag(initialData._id, payload) : await createFlag(payload);
      setAlert({ type: 'success', message: `Flag ${isEdit ? 'updated' : 'created'} successfully!` });
      setErrorMsg('');
    } catch {
      setAlert({ type: 'error', message: `Failed to ${isEdit ? 'update' : 'create'} flag.` });
    }
  };

  const userOptions = users
    .filter(user => !selectedUsers.includes(user._id || user.id))
    .map(user => ({ label: user.name || user.id, value: user._id || user.id }));

  const addUser = id => setSelectedUsers(prev => [...prev, id]);
  const removeUser = id => setSelectedUsers(prev => prev.filter(uid => uid !== id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-2xl flex flex-col md:flex-row overflow-hidden mx-auto">
        {/* Left section: Flag details */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-center md:text-left">
            {isEdit ? 'Edit Flag' : 'New Feature Flag'}
          </h2>

          {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}

          <label className="block text-sm mb-1">Name *</label>
          <input
            className="w-full border rounded p-2 mb-3 max-w-xs"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isEdit}
          />

          <label className="block text-sm mb-1">Description</label>
          <input className="w-full border rounded p-2 mb-3" value={description} onChange={e => setDescription(e.target.value)} />

          <label className="block text-sm mb-1">Tags (comma-separated)</label>
          <input className="w-full border rounded p-2 mb-4" value={tags} onChange={e => setTags(e.target.value)} />

          <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
            <span className="text-sm">Enabled</span>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${enabled ? 'bg-green-500' : 'bg-gray-300'} inline-flex w-12 h-6 rounded-full`}
            >
              <span
                className={`inline-block w-5 h-5 bg-white rounded-full transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </Switch>
          </div>

          <div className="flex justify-center md:justify-end gap-2">
            <button className="bg-gray-200 px-4 py-2 rounded" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-black text-white px-4 py-2 rounded" onClick={handleSubmit}>
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>

        {/* Right section: Rollout & Users */}
        <div className="w-full md:w-1/2 bg-gray-50 border-t md:border-t-0 md:border-l p-4">
          <label className="block text-sm mb-1">Rollout Percentage</label>
          <div className="flex items-center mb-4 justify-center md:justify-start">
            <input
              type="range"
              min={0}
              max={100}
              value={rollout}
              onChange={e => setRollout(Number(e.target.value))}
              className="flex-1 mr-2 h-2 appearance-none bg-black rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ maxWidth: '140px' }}
            />
            <input
              type="number"
              value={rollout}
              onChange={e => setRollout(Number(e.target.value))}
              min={0}
              max={100}
              className="w-16 border rounded px-2"
            />
          </div>
          <label htmlFor="environment" className="block mb-2 text-sm">Environment</label>
          <select
            id="environment"
            className="w-full px-3 py-2 border rounded mb-4"
            value={environment}
            onChange={e => setEnvironment(e.target.value)}
          >
            <option value="dev">Development</option>
            <option value="staging">Staging</option>
            <option value="prod">Production</option>
          </select>
          <label className="block text-sm mb-1 text-center md:text-left">Add Target Users</label>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">Error loading users</p>
          ) : (
            <Dropdown options={userOptions} onSelect={addUser} placeholder="Search and select user" />
          )}

          {selectedUsers.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1 text-center md:text-left">Added Users:</h4>
              <ul className="flex flex-wrap gap-2 justify-center md:justify-start">
                {selectedUsers.map(uid => (
                  <li key={uid} className="bg-black text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    {uid}
                    <button onClick={() => removeUser(uid)} className="ml-1 text-red-300">&times;</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {alert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm text-center mx-4">
            <p className="mb-4">{alert.message}</p>
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={() => {
                setAlert(null);
                if (alert.type === 'success') {
                  isEdit ? onUpdated() : onCreated();
                  onClose();
                }
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFlagForm;
