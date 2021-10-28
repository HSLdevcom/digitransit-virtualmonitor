import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { ISides, ITitle } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Loading from './Loading';
import InformationDisplayContainer from './InformationDisplayContainer';
import { getStationIds, isPlatformOrTrackVisible } from '../util/monitorUtils';
import TrainDataFetcher from './TrainDataFetcher';
import { uuidValidateV5 } from '../util/monitorUtils';
import { isConstructorDeclaration } from 'typescript';

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
}

const WithDatabaseConnection: FC<IProps> = ({ location }) => {
  const [view, setView] = useState({});
  const [fetched, setFetched] = useState(false);
  const [hash, setHash] = useState(undefined);
  useEffect(() => {
    if (location && !location?.state?.view?.cards) {
      const hash: Array<string> = location.search.split('cont=');
      monitorAPI.get(hash[1]).then(r => {
        setHash(hash[1]);
        setFetched(true);
        setView(r);
      });
    }
  }, []);

  const monitor = fetched ? view : location?.state?.view.cards;
  if ((!fetched && !location?.state?.view?.cards) || !monitor?.contenthash) {
    return <Loading />;
  }

  const stationIds = getStationIds(monitor);
  const showPlatformsOrTracks = stationIds.length
    ? isPlatformOrTrackVisible(monitor)
    : false;
  return (
    <>
      {monitor.isInformationDisplay ? (
        <InformationDisplayContainer monitor={monitor} />
      ) : (
        <>
          {stationIds.length && showPlatformsOrTracks ? (
            <TrainDataFetcher
              monitor={monitor}
              stationIds={stationIds}
              staticContentHash={
                monitor.contenthash ? monitor.contenthash : undefined
              }
              staticUrl={uuidValidateV5(hash) ? hash : undefined}
              staticViewTitle={location?.state?.viewTitle}
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
            />
          )}
        </>
      )}
    </>
  );
};

export default WithDatabaseConnection;
