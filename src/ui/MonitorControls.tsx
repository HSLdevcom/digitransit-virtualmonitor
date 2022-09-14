import React, { FC, useState } from 'react';
import ImportMonitorModal from './ImportMonitorModal';

const MonitorControls = () => {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <>
      {importModalOpen && (
        <ImportMonitorModal handleOpenState={setImportModalOpen} />
      )}
      <div className="monitor-controls">
        <button
          onClick={() => setImportModalOpen(!importModalOpen)}
          className="monitor-button white"
        >
          Tuo monitori
        </button>
      </div>
    </>
  );
};

export default MonitorControls;
