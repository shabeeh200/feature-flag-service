import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import axios from 'axios';

const CreateFlagForm = ({ onClose, onCreated }) => {
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [tags, setTags] = useState('');

//   const handleSubmit = async () => {
//     const payload = {
//       key: key.trim(),
//       description: description.trim(),
//       enabled,
//       tags: tags
//         .split(',')
//         .map((t) => t.trim())
//         .filter(Boolean),
//     };

//     try {
//       await axios.post('/flags', payload);   // adjust URL to your API
//       onCreated(payload);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to create flag');
//     }
//   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">New Feature Flag</h2>

        <label className="block mb-2 text-sm font-medium">Key</label>
        <input
          className="w-full px-3 py-2 border rounded mb-4"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="e.g. new-dashboard"
        />

        <label className="block mb-2 text-sm font-medium">Description</label>
        <input
          className="w-full px-3 py-2 border rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
        />

        <label className="block mb-2 text-sm font-medium">Tags (comma-separated)</label>
        <input
          className="w-full px-3 py-2 border rounded mb-4"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="#ui, #beta"
        />

        <div className="flex items-center mb-6">
          <span className="mr-2 text-sm">Enabled</span>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
              enabled ? 'bg-green-500' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            // onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlagForm;
