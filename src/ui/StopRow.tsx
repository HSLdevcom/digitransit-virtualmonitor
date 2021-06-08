import { gql, useLazyQuery } from '@apollo/client';
import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import StopRoutesModal from './StopRoutesModal';
import StopCode from './StopCode';
import Icon from './Icon';
import { IStopInfo } from './StopInfoRetriever';
import './StopRow.scss';
import sortBy from 'lodash/sortBy';

interface IProps {
  readonly stop: IStopInfo;
  readonly onDelete: Function;
  readonly stopId?: string;
}

const GET_ROUTES = gql`
  query getRoutes($id: String!) {
    stop(id: $id) {
      name
      routes {
        shortName
        gtfsId
      }
    }
  }
`;

const StopRow: FC<IProps & WithTranslation> = ({
  stop,
  onDelete,
  stopId,
  t,
}) => {
  const [hiddenRoutes, setHiddenRoutes] = useState([]);
  const [showModal, changeOpen] = useState(false);
  const [routesFetched, setRoutesFetched] = useState(false);
  const gethidden = routes => {
    setHiddenRoutes(routes);
    changeOpen(false);
  };
  const [getRoutes, { loading, data, error }] = useLazyQuery(GET_ROUTES);
  if (!routesFetched) {
    getRoutes({ variables: { id: stopId } });
    setRoutesFetched(true);
  }
  const handleClick = () => {
    if (data) {
      changeOpen(true);
    }
  };
  let routes;
  if (error) {
    return <div>Error...</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (data) {
    if (!routes) {
      routes = sortBy(
        sortBy(data.stop.routes, 'shortName'),
        'shortName.length',
      );
    }
  }

  return (
    <div className="stop-row-container">
      <div className="stop-row-stop icon">
        <Icon img="stop-bus" color={'#007ac9'} />
      </div>
      <div className="stop-row-main">
        <div className="stop-upper-row">
          {stop.name}
          <div className="hidden-routes">{t('hiddenRoutes')}</div>
        </div>
        {showModal && (
          <div className="modal-container">
            <StopRoutesModal
              hiddenRoutes={hiddenRoutes}
              closeModal={gethidden}
              showModal={showModal}
              stop={stop}
              routes={routes}
            />
          </div>
        )}
        <div className="stop-bottom-row">
          {stop.desc && <div className="address">{stop.desc}</div>}
          <StopCode code={stop.code} />
          <div className="hidden-choices" role="button" onClick={handleClick}>
            {!hiddenRoutes.length && t('hiddenNoChoices')}
            {hiddenRoutes.length > 0 && (
              <span>
                {' '}
                {hiddenRoutes.length
                  .toString()
                  .concat(' / ')
                  .concat(data.stop.routes.length.toString())}{' '}
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className="stop-row-delete icon"
        onClick={() => onDelete(stop.gtfsId)}
      >
        <Icon img="delete" color={'#888888'} />
      </div>
      <div className="stop-row-drag icon">
        <Icon img="drag" color={'#888888'} />
      </div>
    </div>
  );
};

export default withTranslation('translations')(StopRow);
