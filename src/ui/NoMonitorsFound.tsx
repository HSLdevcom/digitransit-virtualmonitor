import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MonitorOverlay from './MonitorOverlay';

const NoMonitorsFound = () => {
  const [t] = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);

  let to;
  return (
    <div
      className="not-found"
      onMouseMove={() => {
        setShowOverlay(true);
        clearTimeout(to);
        to = setTimeout(() => setShowOverlay(false), 3000);
      }}
    >
      <MonitorOverlay
        show={showOverlay}
        createNew
        buttonTranslationKey={'quickDisplayCreate'}
      />
      <span>{t('noMonitors')}</span>
    </div>
  );
};
export default NoMonitorsFound;
