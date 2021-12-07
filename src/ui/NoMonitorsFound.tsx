import React, { FC, useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import MonitorOverlay from './MonitorOverlay';

interface IProps {
  white?: boolean;
  isPreview?: boolean;
}
const NoMonitorsFound: FC<IProps & WithTranslation> = props => {
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
        isPreview={false}
        buttonTranslationKey={'quickDisplayCreate'}
      />
      <span> {props.t('noMonitors')} </span>
    </div>
  );
};
export default withTranslation('translations')(NoMonitorsFound);
