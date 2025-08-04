// src/FilterControls.jsx
import React from 'react';

const FilterControls = ({ search, setSearch, tags, selectedTag, setSelectedTag }) => (
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <input
        type="text"
        className="w-full md:w-2/3 lg:w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Search flags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="w-full md:w-1/3 lg:w-1/4 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
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
  </div>
);

export default FilterControls;
