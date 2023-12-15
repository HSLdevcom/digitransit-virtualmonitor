import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import monitorAPI from '../api';
import { ISides, ITitle } from '../util/Interfaces';
import UserMonitorCard from './UserMonitorCard';
import ContentContainer from './ContentContainer';
import IndexPage from './IndexPage';
import Loading from './Loading';
import MonitorControls from './MonitorControls';
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
}
interface ILocation {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: IState;
}
interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly location?: ILocation;
}

const UserMonitors: React.FC<IProps> = props => {
  const [t] = useTranslation();
  const [userMonitorsState, setUserMonitorsState] = useMergeState({
    views: [],
    loading: true,
    error: false,
  });

  const refetchMonitors = controller => {
    if (!controller) {
      controller = new AbortController();
    }
    monitorAPI
      .getAllMonitorsForUser(controller.signal)
      .then((r: Array<Iv>) => {
        setUserMonitorsState({ views: r.reverse(), loading: false });
      })
      .catch(e => setUserMonitorsState({ error: true }));
  };
  useEffect(() => {
    const controller = new AbortController();
    refetchMonitors(controller);
    return () => {
      controller.abort();
    };
  }, []);

  const { views, loading } = userMonitorsState;

  if (loading) {
    return <Loading white />;
  }
  const button = (
    <>
      <Link to={'/monitors/createview'} className="monitor-button blue">
        {t('quickDisplayCreate')}
      </Link>
      {!views.length && (
        <MonitorControls
          monitorCount={views.length}
          refetchMonitors={() => {
            refetchMonitors(undefined);
          }}
        />
      )}
    </>
  );

  const monitors =
    !!views.length &&
    views.map((view, i) => {
      const style = { '--delay-length': `0.${1 + i}s` } as React.CSSProperties;
      return (
        <div
          key={`card${view.url}`}
          className={'card animate-in'}
          style={style}
        >
          <UserMonitorCard
            key={`monitor#${i}`}
            onDelete={() => refetchMonitors(undefined)}
            view={view}
          />
        </div>
      );
    });

  return (
    <ContentContainer>
      {views.length ? (
        <div className="user-monitors-container">
          <MonitorControls
            monitorCount={views.length}
            refetchMonitors={() => {
              refetchMonitors(undefined);
            }}
          />
          <div className="cards-container">{monitors}</div>
          <div className="create-button-container">{button}</div>
        </div>
      ) : (
        <IndexPage buttons={button} />
      )}
    </ContentContainer>
  );
};

export default UserMonitors;
