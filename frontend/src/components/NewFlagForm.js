
import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { useFlags } from '../hooks/useFlags';

const CreateFlagForm = ({
  onClose,
  onCreated,      // for create
  onUpdated,      // for edit
  initialData,    // undefined for create / { _id, name, description, enabled, tags }
}) => {
  const { createFlag, updateFlag } = useFlags();

  // 1) State for form fields
  const [name, setName]           = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled]     = useState(false);
  const [tags, setTags]           = useState('');
  const [error, setError]         = useState('');
  const [alert, setAlert]         = useState(null);

  // 2) On mount (or when initialData changes), pre-fill if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setEnabled(initialData.enabled);
      setTags((initialData.tags || []).join(','));
    }
  }, [initialData]);

  // 3) Determine mode
  const isEdit = Boolean(initialData);

  // 4) Submit handler
  const handleSubmit = async () => {
    if (!name.trim()) return setError('Flag name is required');
    if (name.includes(' ')) return setError('Flag name must not contain spaces');

    const payload = {
      name: name.trim(),
      description: description.trim(),
      enabled,
      tags: tags
        .split(',')
        .map(tag => tag.replace(/^#/, '').trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await updateFlag(initialData._id, payload);
        setAlert({ type: 'success', message: 'Flag updated successfully!' });
      } else {
        await createFlag(payload);
        setAlert({ type: 'success', message: 'Flag created successfully!' });
      }
      setError('');
    } catch (err) {
      setAlert({ type: 'error', message: isEdit ? 'Failed to update flag.' : 'Failed to create flag.' });
    }
  };

  return (
    <>
      {/* Form Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? 'Edit Feature Flag' : 'New Feature Flag'}
          </h2>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <label className="block mb-2 text-sm">Flag Name *</label>
          <input
            className="w-full px-3 py-2 border rounded mb-4"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. new-dashboard"
            disabled={isEdit}  // optionally disable name in edit mode
          />

          <label className="block mb-2 text-sm">Description</label>
          <input
            className="w-full px-3 py-2 border rounded mb-4"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description"
          />

          <label className="block mb-2 text-sm">Tags (comma-separated)</label>
          <input
            className="w-full px-3 py-2 border rounded mb-4"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. ui,beta"
          />

          <div className="flex items-center mb-6">
            <span className="mr-2 text-sm">Enabled</span>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${enabled ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`} />
            </Switch>
          </div>

          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-black text-white rounded" onClick={handleSubmit}>
              {isEdit ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      {alert && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm text-center">
            <p className="mb-4">{alert.message}</p>
            <button
              className="px-4 py-2 bg-black text-white rounded"
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
    </>
  );
};

export default CreateFlagForm;