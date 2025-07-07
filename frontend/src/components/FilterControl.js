// src/FilterControls.jsx
import React from 'react';

const FilterControls = ({ search, setSearch, tags, selectedTag, setSelectedTag }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <input
      type="text"
      className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded shadow-sm"
      placeholder="Search flags..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <select
      className="w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded shadow-sm"
      value={selectedTag}
      onChange={(e) => setSelectedTag(e.target.value)}
    >
      <option value="">All Tags</option>
      {tags.map((tag) => (
        <option key={tag} value={tag}>
          #{tag}
        </option>
      ))}
    </select>
  </div>
);

export default FilterControls;
