// src/pages/DashboardPage.jsx
import React from "react";
import useFlagAnalytics from "../hooks/useFlagAnalytics";

const DashboardPage = () => {
  const { data, loading } = useFlagAnalytics();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-xl">
        Building your dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Feature Flags Dashboard</h1>

      {/* Metric Cards */}
      <div className="flex flex-wrap gap-4 justify-start">
        <Card value={data.totalFlags} label="Total Flags" icon={flagIcon} />
        <Card value={data.newThisWeek} label="New This Week" icon={rocketIcon} />
        <Card value={data.evalsThisWeek} label="Evaluations" icon={eyeIcon} />
        <Card value={data.enabledCount} label="Enabled Flags" icon={checkIcon} />
        <Card value={data.disabledCount} label="Disabled Flags" icon={closeIcon} />
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <ChartPlaceholder title="Flags by Environment (Coming Soon)" />
        <ChartPlaceholder title="Enabled vs Disabled (Coming Soon)" />
        <ChartPlaceholder title="Rollout Buckets (Coming Soon)" className="md:col-span-2" />
      </div>
    </div>
  );
};

const Card = ({ value, label, icon }) => (
  <div className="flex h-20 w-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white shadow-sm transition hover:border-gray-400">
    <div className="flex items-center">
      <span className="mr-2 text-gray-500">{icon}</span>
      <span className="font-bold text-gray-700 text-lg">{value}</span>
    </div>
    <div className="mt-1 text-sm text-gray-400">{label}</div>
  </div>
);

const ChartPlaceholder = ({ title, className = "" }) => (
  <div
    className={`rounded-xl border border-dashed border-gray-300 bg-white shadow-sm p-6 text-gray-400 text-center text-sm ${className}`}
    style={{ minHeight: "200px" }}
  >
    {title}
  </div>
);

// Icons
const flagIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-500" viewBox="0 0 24 24">
    <path d="M4,2A2,2 0 0,0 2,4V22H4V14H20L17,9L20,4H4Z" />
  </svg>
);

const rocketIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-500" viewBox="0 0 24 24">
    <path d="M2.81,2L2,2.81L5.22,6.03C4.67,7.2 4.2,8.42 3.85,9.68C4.21,10.14 4.65,10.5 5.12,10.76C5.5,9.53 6.03,8.36 6.68,7.26L10.91,11.5C9.82,12.15 8.64,12.68 7.41,13.04C7.66,13.51 8.02,13.95 8.47,14.31C9.73,13.96 10.95,13.5 12.12,12.95L15.34,16.17L14.53,17L21,23.46L21.77,22.7L2.81,2Z" />
  </svg>
);

const eyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-500" viewBox="0 0 24 24">
    <path d="M12,6A9,9 0 0,0 3,12A9,9 0 0,0 12,18A9,9 0 0,0 21,12A9,9 0 0,0 12,6M12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16Z" />
  </svg>
);

const checkIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-green-500" viewBox="0 0 24 24">
    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
  </svg>
);

const closeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-500" viewBox="0 0 24 24">
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
  </svg>
);

export default DashboardPage;
