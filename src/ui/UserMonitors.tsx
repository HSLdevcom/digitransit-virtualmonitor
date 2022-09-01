import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import monitorAPI from '../api';
import { ISides, ITitle } from '../util/Interfaces';
import UserMonitorCard from './UserMonitorCard';
import ContentContainer from './ContentContainer';
import IndexPage from './IndexPage';
import Loading from './Loading';

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

  useEffect(() => {
    monitorAPI.getAllMonitorsForUser().then((r: Array<Iv>) => {
      setViews(r);
      setChanged(false);
      setLoading(false);
    });
  }, [changed]);

  if (loading) {
    return <Loading white />;
  }
  const button = (
    <Link to={'/monitors/createview'} className="monitor-button blue">
      {t('quickDisplayCreate')}
    </Link>
  );

  const monitors = views.length ? (
    views.map((view, i) => {
      const style = { '--delayLength': `0.${1 + i}s` } as React.CSSProperties;
      return (
        <div key={`card${i}`} className={'card animate-in'} style={style}>
          <UserMonitorCard
            key={`monitor#${i}`}
            onDelete={() => setChanged(true)}
            view={view}
          />
        </div>
      );
    })
  ) : (
    <IndexPage buttons={button} />
  );

  return (
    <ContentContainer>
      <div className="user-monitors-container">
        <div className="cards-container">{monitors}</div>
        {!!views.length && (
          <div className="create-button-container">{button}</div>
        )}
      </div>
    </ContentContainer>
  );
};

export default UserMonitors;
