import React, { FC } from 'react';
import cx from 'classnames';
import MonitorMap from './ui/monitorMap';
type Coordinate = [number, number];
type BoundingBox = [Coordinate, Coordinate];
interface stopsForMap {
  coords: [number | null | undefined, number | null | undefined];
  mode?: string;
}
interface IProps {
  stopsForMap?: stopsForMap[];
  alertComponent?: any;
  preview?: boolean;
}

function getBoundingBox(coordinates: Coordinate[]): BoundingBox {
  if (coordinates.length === 0) {
    return [
      [0, 0],
      [0, 0],
    ];
  }

  let minLat = coordinates[0][0];
  let maxLat = coordinates[0][0];
  let minLng = coordinates[0][1];
  let maxLng = coordinates[0][1];
  for (let i = 1; i < coordinates.length; i++) {
    const lat = coordinates[i][0];
    const lng = coordinates[i][1];

    if (lat && lng) {
      minLat = Math.min(minLat, lat);
      minLng = Math.min(minLng, lng);
      maxLat = Math.max(maxLat, lat);
      maxLng = Math.max(maxLng, lng);
    }
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}
const MonitorMapContainer: FC<IProps> = props => {
  const coordinates = props.stopsForMap.map(s => s.coords);
  const bounds = getBoundingBox(coordinates);
  const isLandscape = true;
  return (
    <div
      className={cx('monitor-container', {
        preview: props.preview,
        portrait: !isLandscape,
        'two-cols': false,
        tightened: false,
      })}
    >
      <MonitorMap
        bounds={bounds}
        stopsForMap={props.stopsForMap}
        preview={props.preview}
      />
    </div>
  );
};
export default MonitorMapContainer;
