import React from 'react';

const cards = [
  { label: 'Total Flags', value: 12 },
  { label: 'Active Flags', value: 8 },
  { label: 'Users', value: 42 },
  { label: 'Rollouts', value: 3 }
];

const DashboardCards = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {cards.map(card => (
      <div key={card.label} className="bg-white shadow rounded p-4 flex flex-col items-center">
        <span className="text-lg font-semibold">{card.value}</span>
        <span className="text-xs text-gray-500">{card.label}</span>
      </div>
    ))}
  </div>
);

export default DashboardCards;