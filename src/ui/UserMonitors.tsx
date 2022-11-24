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
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState([]);
  const [changed, setChanged] = useState(false);

  const refetchMonitors = controller => {
    if (!controller) {
      controller = new AbortController();
    }
    monitorAPI.getAllMonitorsForUser(controller.signal).then((r: Array<Iv>) => {
      setViews(r.reverse());
      setChanged(false);
      setLoading(false);
    });
  };
  useEffect(() => {
    const controller = new AbortController();
    refetchMonitors(controller);
    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <Loading white />;
  }
  const button = (
    <>
      <Link
        role="button"
        to={'/monitors/createview'}
        className="monitor-button blue"
      >
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
      const style = { '--delayLength': `0.${1 + i}s` } as React.CSSProperties;
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
