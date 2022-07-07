import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { ISides, ITitle, ICard } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Loading from './Loading';
import InformationDisplayContainer from './InformationDisplayContainer';
import NoMonitorsFound from './NoMonitorsFound';
import TrainDataPreparer from './TrainDataPreparer';
import { getContentHash, getStaticUrl } from '../util/monitorUtils';

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
  readonly stations: Array<ICard>;
  readonly stops: Array<ICard>;
  readonly showPlatformsOrTracks: boolean;
}

const WithDatabaseConnection: FC<IProps> = ({
  location,
  stations,
  stops,
  showPlatformsOrTracks,
}) => {
  const [view, setView] = useState({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    if (location && !location?.state?.view?.cards) {
      const hash = getContentHash(location.search);
      const url = getStaticUrl(location.search);
      if (hash) {
        monitorAPI.get(hash).then(r => {
          setFetched(true);
          setView(r);
        });
      } else if (url) {
        monitorAPI.getStatic(url).then(r => {
          setFetched(true);
          setView(r);
        });
      }
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
            <TrainDataPreparer
              monitor={monitor}
              stations={stations}
              stops={stops}
            />
          ) : (
            <CarouselDataContainer
              views={monitor.cards}
              languages={monitor.languages}
              initTime={new Date().getTime()}
            />
          )}
        </>
      )}
    </>
  );
};

export default WithDatabaseConnection;
