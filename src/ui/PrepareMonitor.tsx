import React, { FC } from 'react';
import PreviewModal from './PreviewModal';
import WithDatabaseConnection from './WithDatabaseConnection';
import {
  getStopsAndStationsActuallyFromViews,
  getTrainStationData,
} from '../util/monitorUtils';
import { IMonitor } from '../util/Interfaces';

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

  if (preview) {
    return (
      <PreviewModal
        view={preview.view}
        languages={preview.languages}
        isOpen={preview.isOpen}
        onClose={preview.onClose}
        isLandscape={preview.isLandscape}
        stations={stations}
        stops={stops}
        coords={[]}
      />
    );
  }
  return (
    <WithDatabaseConnection
      location={location}
      stations={stations}
      stops={stops}
    />
  );
};

export default PrepareMonitor;
