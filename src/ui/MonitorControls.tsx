import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImportMonitorModal from './ImportMonitorModal';

interface IProps {
  refetchMonitors: () => void;
  monitorCount: number;
}

const MonitorControls: FC<IProps> = ({ refetchMonitors, monitorCount }) => {
  const [t] = useTranslation();
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <>
      {importModalOpen && (
        <ImportMonitorModal
          monitorCount={monitorCount}
          refetchMonitors={refetchMonitors}
          onRequestClose={() => setImportModalOpen(false)}
        />
      )}
      <div className="monitor-controls">
        <button
          onClick={() => setImportModalOpen(!importModalOpen)}
          className="monitor-button white"
        >
          {t('import-monitor')}
        </button>
      </div>
    </>
  );
};

export default MonitorControls;
