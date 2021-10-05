import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import monitorAPI from '../api';
import { ISides, ITitle } from '../util/Interfaces';
import UserMonitorCard from './UserMonitorCard';
import ContentContainer from './ContentContainer';
import './UserMonitors.scss';

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
  user: any; // todo: refactor when we have proper user
}

const UserMonitors: React.FC<IProps & WithTranslation> = props => {
  const [views, setViews] = useState({});

  useEffect(() => {
    monitorAPI.getAllMonitorsForUser().then(r => {
      setViews(r);
    });
  }, []);

  const monitors = Array.isArray(views)
    ? views.map(view => {
        return <UserMonitorCard view={view} />;
      })
    : [];
  if (!monitors || !monitors.length) {
    return null;
  }
  return (
    <ContentContainer>
      {Array.isArray(monitors) &&
        monitors.map((monitor, i) => {
          return <div key={`monitor#${i}`}>{monitor}</div>;
        })}
      <Link to={'/createStaticView'}>
        <span className="create-container">
          <button className="btn"> {props.t('quickDisplayCreate')} </button>
        </span>
      </Link>
    </ContentContainer>
  );
};

export default withTranslation('translations')(UserMonitors);
