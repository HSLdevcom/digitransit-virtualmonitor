import React, { FC } from 'react';
import cx from 'classnames';
import MonitorMap from './ui/monitorMap';

interface IProps {
  preview?: boolean;
  mapSettings: any;
  modal?: boolean;
  updateMap?: any;
}

const MonitorMapContainer: FC<IProps> = ({
  preview,
  mapSettings,
  modal,
  updateMap,
}) => {
  const isLandscape = true;
  return (
    <div
      className={cx('monitor-container', {
        preview: preview,
        portrait: !isLandscape,
        'two-cols': false,
        tightened: false,
      })}
    >
      <MonitorMap
        preview={preview}
        mapSettings={mapSettings}
        modal={modal}
        updateMap={updateMap}
      />
    </div>
  );
};
export default MonitorMapContainer;
