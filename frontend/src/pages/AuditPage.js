import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import CenteredModal from '../components/CenteredModal';
import { useFlagLogs } from '../hooks/useFlagLog';
import { FaChevronDown } from 'react-icons/fa';

const AuditPage = () => {
  const { logs, loading, error } = useFlagLogs();
  const [activeLog, setActiveLog] = useState(null);

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
      {loading && <div className="text-center py-8 text-gray-500">Loading audit logs…</div>}
      {error && <div className="text-center py-8 text-red-600">Failed to load audit logs. Please try again later.</div>}
      <div className="space-y-4">
        {logs.map(log => (
          <div
            key={log._id}
            className="bg-white border border-black rounded shadow hover:shadow-lg transition"
          >
            <button
              onClick={() => setActiveLog(log)}
              className="w-full text-left px-6 py-4 flex justify-between items-center"
            >
              <div>
                <div className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div className="text-base font-medium text-gray-900">
                  [{log.action.toUpperCase()}] by {log.user}
                </div>
              </div>
              <FaChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
      {activeLog && (
        <CenteredModal onClose={() => setActiveLog(null)}>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            [{activeLog.action.toUpperCase()}] by {activeLog.user}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {new Date(activeLog.timestamp).toLocaleString()}
          </p>
          <div className="overflow-x-auto">
            {Object.keys(activeLog.changes).length === 0 ? (
              <p className="text-gray-600 text-sm">No field changes.</p>
            ) : (
              <table className="w-full text-sm border-t border-black">
                <thead>
                  <tr className="bg-gray-100 text-gray-500">
                    <th className="text-left px-2 py-2 border-b border-black">Field</th>
                    <th className="text-left px-2 py-2 border-b border-black">From</th>
                    <th className="text-left px-2 py-2 border-b border-black">To</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(activeLog.changes).map(
                    ([field, { from, to }]) => (
                      <tr key={field} className="border-t border-black hover:bg-gray-50">
                        <td className="px-2 py-2 font-mono text-gray-700">{field}</td>
                        <td className="px-2 py-2 text-gray-600">{from === null ? '—' : String(from)}</td>
                        <td className="px-2 py-2 text-gray-900 font-semibold">{String(to)}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CenteredModal>
      )}
    </PageContainer>
  );
};

export default AuditPage;