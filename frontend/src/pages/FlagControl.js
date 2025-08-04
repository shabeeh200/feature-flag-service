import React, { useState, useEffect } from 'react';
import PageContainer from '../components/LayoutComponents/PageContainer';
import FlagTable from '../components/FlagComponents/FlagTable';
import NewFlagForm from '../components/FlagComponents/NewFlagForm';
import { useFlags } from '../hooks/useFlags';

const DashboardPage = () => {
  const {
    flags,
    loading,
    error,
    page,
    totalPages,
    fetchFlags,
    toggleFlag,
    deleteFlag,
  } = useFlags();

  const [showModal, setShowModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState(null);

  useEffect(() => {
    fetchFlags();
  },  [fetchFlags]);

  const handleCreated = async () => {
    await fetchFlags();
    setShowModal(false);
    setEditingFlag(null);
  };
  const handleUpdated = async () => {
    await fetchFlags();
    setShowModal(false);
    setEditingFlag(null);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flags Controls</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800 transition"
          style={{ minWidth: 140 }}
        >
          + Create Flag
        </button>
      </div>
      <FlagTable
        flags={flags}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        onToggle={toggleFlag}
        onDelete={deleteFlag}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        fetchFlags={fetchFlags}
      />
      {showModal && (
        <NewFlagForm
          onClose={() => {
            setShowModal(false);
            setEditingFlag(null);
          }}
          onCreated={handleCreated}
        />
      )}
    </PageContainer>
  );
};

export default DashboardPage;
