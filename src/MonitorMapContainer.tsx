import React, { FC } from 'react';
import cx from 'classnames';
import MonitorMap from './ui/monitorMap';
interface stopsForMap {
  coords: [number | null | undefined, number | null | undefined];
  mode?: string;
}
interface IProps {
  stopsForMap?: stopsForMap[];
  preview?: boolean;
  mapSettings: any;
}

const MonitorMapContainer: FC<IProps> = ({
  stopsForMap,
  preview,
  mapSettings,
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
        stopsForMap={stopsForMap}
        preview={preview}
        mapSettings={mapSettings}
      />
    </div>
  );
};
export default MonitorMapContainer;
