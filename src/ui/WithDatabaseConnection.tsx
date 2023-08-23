import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { ISides, ITitle, ICard } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Loading from './Loading';
import InformationDisplayContainer from './InformationDisplayContainer';
import NoMonitorsFound from './NoMonitorsFound';
import TrainDataPreparer from './TrainDataPreparer';
import { getParams } from '../util/queryUtils';
import { MonitorContext } from '../contexts';
import QueryError from './QueryError';
import {
  getTrainStationData,
  isPlatformOrTrackVisible,
} from '../util/monitorUtils';
import { useMergeState } from '../util/utilityHooks';

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
  readonly showPlatformsOrTracks?: boolean;
}

const WithDatabaseConnection: FC<IProps> = ({ location }) => {
  const [queryError, setQueryError] = useState(false);
  const [monitorState, setMonitorState] = useMergeState({
    loading: true,
    view: undefined,
    stations: undefined,
    stops: undefined,
  });
  useEffect(() => {
    if (location && !location?.state?.view?.cards) {
      const { url, cont: hash } = getParams(location.search);
      if (hash) {
        monitorAPI
          .get(hash)
          .then(r => {
            setMonitorState({
              loading: false,
              view: r,
              stations: getTrainStationData(r, 'STATION'),
              stops: getTrainStationData(r, 'STOP'),
            });
          })
          .catch(() => {
            setQueryError(true);
            setMonitorState({ loading: false });
          });
      } else if (url) {
        monitorAPI
          .getStatic(url)
          .then(r => {
            setMonitorState({
              loading: false,
              view: r,
              stations: getTrainStationData(r, 'STATION'),
              stops: getTrainStationData(r, 'STOP'),
            });

            if (queryError) {
              setQueryError(false);
            }
          })
          .catch(() => {
            setQueryError(true);
            setMonitorState({ loading: false });
          });
      } else {
        setQueryError(true);
      }
    }
  }, [queryError]);

  const { loading, view, stops, stations } = monitorState;
  const monitor = !loading ? view : location?.state?.view.cards;
  if (queryError) {
    return (
      <MonitorContext.Provider value={monitor}>
        <QueryError setQueryError={setQueryError} />
      </MonitorContext.Provider>
    );
  }
  if ((loading && !location?.state?.view?.cards) || !monitor?.contenthash) {
    if (!loading) {
      return <NoMonitorsFound />;
    }
    return <Loading />;
  }
  const layout = view.cards[0].layout;

  const showInfoDisplay = layout > 17 && layout < 19;

  return (
    <MonitorContext.Provider value={monitor}>
      {showInfoDisplay ? (
        <InformationDisplayContainer />
      ) : (
        <>
          {(stations.length || stops.length) &&
          isPlatformOrTrackVisible(view) ? (
            <TrainDataPreparer
              stations={stations}
              stops={stops}
              setQueryError={setQueryError}
            />
          ) : (
            <CarouselDataContainer
              initTime={new Date().getTime()}
              setQueryError={setQueryError}
              queryError={queryError}
            />
          )}
        </>
      )}
    </MonitorContext.Provider>
  );
};

export default WithDatabaseConnection;
