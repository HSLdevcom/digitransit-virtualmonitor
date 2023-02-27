import React, { FC } from 'react';
import PreviewModal from './PreviewModal';
import WithDatabaseConnection from './WithDatabaseConnection';
import { getTrainStationData } from '../util/monitorUtils';
import { IMonitor } from '../util/Interfaces';
import { MapContext } from '../contexts';
import { useMergeState } from '../util/utilityHooks';

interface IProps {
  readonly location?: any;
  readonly preview?: {
    view: IMonitor;
    languages: Array<string>;
    isOpen: boolean;
    onClose: (boolean) => void;
    isLandscape: boolean;
  };
}

const PrepareMonitor: FC<IProps> = ({ location, preview }) => {
  const monitor = location ? location?.state?.view : preview.view;
  const stations = monitor ? getTrainStationData(monitor, 'STATION') : [];
  const stops = monitor ? getTrainStationData(monitor, 'STOP') : [];
  const [mapProps, setMapProps] = useMergeState({
    center: undefined,
    zoom: undefined,
  });
  if (preview) {
    return (
      <MapContext.Provider value={{ mapProps, setMapProps }}>
        <PreviewModal
          view={preview.view}
          languages={preview.languages}
          isOpen={preview.isOpen}
          onClose={preview.onClose}
          isLandscape={preview.isLandscape}
          stations={stations}
          stops={stops}
        />
      </MapContext.Provider>
    );
  }
  return (
    <MapContext.Provider value={{ mapProps, setMapProps }}>
      <WithDatabaseConnection
        location={location}
        stations={stations}
        stops={stops}
      />
    </MapContext.Provider>
  );
};

export default PrepareMonitor;
