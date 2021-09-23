import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { ISides, ITitle } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Loading from './Loading';
import InformationDisplayContainer from './InformationDisplayContainer';
import TrainDataFetcher from './TrainDataFetcher';

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
  useEffect(() => {
    if (location && !location?.state?.view?.cards) {
      const isStatic = location.pathname.indexOf('static') !== -1;
      const hash: Array<string> = location.search.split('cont=');
      if (isStatic) {
        monitorAPI.getStaticMonitor(hash[1]).then(r => {
          setFetched(true);
          setView(r);
        });
      } else {
        monitorAPI.get(hash[1]).then(r => {
          setFetched(true);
          setView(r);
        });
      }
    }
  }, []);

  const monitor = fetched ? view : location?.state?.view.cards;
  if ((!fetched && !location?.state?.view?.cards) || !monitor?.contenthash) {
    return <Loading />;
  }
  const hasTrainStops = true;
  return (
    <>
      {monitor.isInformationDisplay ? (
        <InformationDisplayContainer monitor={monitor} />
      ) : (
        <>
          {hasTrainStops ? (
            <TrainDataFetcher monitor={monitor} />
          ) : (
            <CarouselDataContainer
              views={monitor.cards}
              languages={monitor.languages}
            />
          )}
        </>
      )}
    </>
  );
};

export default WithDatabaseConnection;
