import React, { FC, useContext, useEffect } from 'react';
import { useMergeState } from './util/utilityHooks';
import L from 'leaflet';
import MonitorMap from './ui/monitorMap';
import { MapContext } from './contexts';
type Coordinate = [number, number];
type BoundingBox = [Coordinate, Coordinate];
interface IProps {
  coords?: any;
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
  const coordinates = props.coords.map(s => s.coords);
  const [state, setState] = useMergeState({
    bounds: getBoundingBox(coordinates),
  });

  const { bounds } = state;
  return <MonitorMap bounds={bounds} coords={props.coords} />;
};
export default MonitorMapContainer;
