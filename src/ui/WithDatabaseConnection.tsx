import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { ISides, ITitle, ICard } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Loading from './Loading';
import InformationDisplayContainer from './InformationDisplayContainer';
import { getIdAndRoutes, isPlatformOrTrackVisible } from '../util/monitorUtils';
import NoMonitorsFound from './NoMonitorsFound';
import TrainDataFetcher from './TrainDataFetcher';
import { uuidValidateV5, getContentHash } from '../util/monitorUtils';

interface Iv {
  columns: ISides;
  duration: number;
  id: number;
  layout: number;
  title: ITitle;
  cards?: any;
  contenthash?: string;
}
interface IState {
  view: Iv;
  viewTitle?: string;
}
interface ILocation {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: IState;
}
interface IProps {
  readonly location?: ILocation;
  readonly instance?: string;
  readonly stations: Array<ICard>;
  readonly stops: Array<ICard>;
  readonly showPlatformsOrTracks: boolean;
}

const WithDatabaseConnection: FC<IProps> = ({
  location,
  instance,
  stations,
  stops,
  showPlatformsOrTracks,
}) => {
  const [view, setView] = useState({});
  const [fetched, setFetched] = useState(false);
  const [hash, setHash] = useState(undefined);
  useEffect(() => {
    if (location && !location?.state?.view?.cards) {
      const hash = getContentHash(location.search);
      monitorAPI.get(hash).then(r => {
        setHash(hash);
        setFetched(true);
        setView(r);
      });
    }
  }, []);

  const monitor = fetched ? view : location?.state?.view.cards;
  if ((!fetched && !location?.state?.view?.cards) || !monitor?.contenthash) {
    if (fetched) {
      return <NoMonitorsFound />;
    }
    return <Loading />;
  }

  return (
    <>
      {monitor.isInformationDisplay ? (
        <InformationDisplayContainer monitor={monitor} />
      ) : (
        <>
          {(stations.length || stops.length) && showPlatformsOrTracks ? (
            <TrainDataFetcher
              monitor={monitor}
              stations={stations}
              stops={stops}
              staticContentHash={
                monitor.contenthash ? monitor.contenthash : undefined
              }
              staticUrl={uuidValidateV5(hash) ? hash : undefined}
              staticViewTitle={location?.state?.viewTitle}
              fetchOnlyHsl={
                instance === 'hsl'
                  ? true
                  : stations
                      .concat(stops)
                      .every(x => x.gtfsId.startsWith('HSL'))
              }
              fetchAlsoHsl={
                instance === 'hsl'
                  ? false
                  : !stations
                      .concat(stops)
                      .every(x => x.gtfsId.startsWith('HSL')) &&
                    stations.concat(stops).some(x => x.gtfsId.startsWith('HSL'))
              }
            />
          ) : (
            <CarouselDataContainer
              views={monitor.cards}
              languages={monitor.languages}
              staticContentHash={
                monitor.contenthash ? monitor.contenthash : undefined
              }
              staticUrl={uuidValidateV5(hash) ? hash : undefined}
              staticViewTitle={location?.state?.viewTitle}
              initTime={new Date().getTime()}
            />
          )}
        </>
      )}
    </>
  );
};

export default WithDatabaseConnection;
