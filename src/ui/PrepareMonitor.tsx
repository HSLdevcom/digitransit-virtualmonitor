import React, { FC } from 'react';
import PreviewModal from './PreviewModal';
import WithDatabaseConnection from './WithDatabaseConnection';
import { getIdAndRoutes, isPlatformOrTrackVisible } from '../util/monitorUtils';
import { IMonitor } from '../util/Interfaces';

interface IProps {
  readonly location?: any;
  readonly preview?: {
    view: IMonitor;
    languages: Array<string>;
    isOpen: boolean;
    onClose: (boolean) => void;
    isLandscape: boolean;
    instance: string;
  };
}

const PrepareMonitor: FC<IProps> = ({ location, preview }) => {
  const monitor = location ? location?.state?.view : preview.view;
  const instance = location ? location?.state?.instance : preview.instance;
  const stations = monitor ? getIdAndRoutes(monitor, 'STATION') : [];
  const stops = monitor ? getIdAndRoutes(monitor, 'STOP') : [];
  const showPlatformsOrTracks =
    stations.length || stops.length ? isPlatformOrTrackVisible(monitor) : false;

  if (location?.state) {
    return (
      <WithDatabaseConnection
        location={location}
        instance={instance}
        stations={stations}
        stops={stops}
        showPlatformsOrTracks={showPlatformsOrTracks}
      />
    );
  } else if (preview) {
    return (
      <PreviewModal
        view={preview.view}
        languages={preview.languages}
        isOpen={preview.isOpen}
        onClose={preview.onClose}
        isLandscape={preview.isLandscape}
        instance={instance}
        stations={stations}
        stops={stops}
        showPlatformsOrTracks={showPlatformsOrTracks}
      />
    );
  }
  return null;
};

export default PrepareMonitor;
