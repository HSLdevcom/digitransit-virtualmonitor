import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { withTranslation, WithTranslation } from 'react-i18next';
import monitorAPI from '../api';
import { ISides, ITitle } from '../util/Interfaces';
import UserMonitorCard from './UserMonitorCard';
import ContentContainer from './ContentContainer';

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

const UserMonitors: React.FC<IProps & WithTranslation> = props => {
  const [views, setViews] = useState({});
  const location = useLocation();

  const id = location.pathname.split('/')[2];
  useEffect(() => {
    monitorAPI.getMonitorsForUser(id).then(r => {
      setViews(r);
    });
  }, []);

  const monitors = Array.isArray(views)
    ? views.map(view => {
        return (
          <UserMonitorCard cards={view.cards} languages={view.languages} contentHash={view.contenthash} />
        );
      })
    : [];
  if (!monitors || !monitors.length) {
    return null;
  }
  return (
    <ContentContainer>
      {Array.isArray(monitors) &&
        monitors.map((monitor, index) => {
          return <>{monitor}</>;
        })}
    </ContentContainer>
  );
};

export default withTranslation('translations')(UserMonitors);
