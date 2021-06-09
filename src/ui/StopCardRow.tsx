import React, { FC, useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { gql, useLazyQuery } from '@apollo/client';
import Icon from './Icon';
import { uniqBy, sortBy }from 'lodash';
import StopViewTitleEditor from './StopViewTitleEditor';
import DTAutosuggest from '@digitransit-component/digitransit-component-autosuggest';
import getSearchContext from './searchContext';
import LayoutAndTimeContainer from './LayoutAndTimeContainer';
import StopListContainer from './StopListContainer';
import { SortableHandle } from 'react-sortable-hoc';

import './StopCardRow.scss';

const getGTFSId = id => {
  if (id && typeof id.indexOf === 'function' && id.indexOf('GTFS:') === 0) {
    if (id.indexOf('#') === -1) {
      return id.substring(5);
    }
    return id.substring(5, id.indexOf('#'));
  }
  return undefined;
};

const GET_STOP = gql`
query stopQuery($ids: [String]) {
  stop: stops(ids: $ids) {
      id
      name
      code
      desc
      gtfsId
      platformCode
      routes {
        shortName
        gtfsId
      }
    }
  }
`;

const GET_STATION = gql`
  query stationQuery($ids: [String]) {
    station: stations(ids: $ids) {
      id
      name
      code
      desc
      gtfsId
      platformCode
      stops {
        desc
        routes {
          shortName
          gtfsId
        }
      }
    }
  }
`;

interface IProps {
  //readonly stopCard: IViewCarouselElement,
  readonly id: number;
  readonly title: string;
  readonly stops: any;
  readonly onCardDelete?: Function;
  readonly onStopDelete?: Function;
  readonly setStops?: Function;
  readonly updateTitle?: Function;
}

const SortableHandleItem = SortableHandle(({ children }) => children);

const StopCardRow: FC<IProps & WithTranslation> = ({
  id,
  title,
  stops,
  onCardDelete,
  onStopDelete,
  setStops,
  updateTitle,
  t,
}) => {
  const lang = t('languageCode');

  const [getStop, stopState] = useLazyQuery(GET_STOP);
  const [getStation, stationState] = useLazyQuery(GET_STATION);

  const onSelect = selected => {
    const properties = selected.properties;
    switch (properties.layer) {
      case 'stop':
        getStop({ variables: {ids: getGTFSId(properties.id)}})
        break;
      case 'station':
        getStation({ variables: {ids: getGTFSId(properties.id)}})
        break;
      default:
        console.log('unknown', selected);
        break;
    }
  };

  const onClear = () => {
    return null;
  };

  useEffect(() => {
    if(stopState.data?.stop) {
      console.log(stopState.data.stop.filter(stop => stop && !stops.some(el => el.id === stop.id)).map(stop => {
        return {
          ...stop,
          routes: sortBy(
            sortBy(stop.routes, 'shortName'),
            'shortName.length',
          ),
        }
      }))
      setStops(id, stopState.data.stop.filter(stop => stop && !stops.some(el => el.id === stop.id)).map(stop => {
        return {
          ...stop,
          routes: sortBy(
            sortBy(stop.routes, 'shortName'),
            'shortName.length',
          ),
        }
      }), false)
    }
  }, [stopState.data]);

  useEffect(() => {
    if(stationState.data?.station) {
      setStops(id, stationState.data.station.filter(s => s && !stops.some(el => el.id === s.id)).map(station => {
        let routes = [];
        station.stops.forEach(stop => routes.push(...stop.routes))
        console.log(routes)
        routes = uniqBy(routes, 'gtfsId');
        console.log(routes)
        routes = sortBy(
          sortBy(routes, 'shortName'),
          'shortName.length',
        );
        return {
          ...station,
          code: t('station'),
          desc: station.stops[0].desc,
          routes: routes,
        }
      }), false)
    }
  }, [stationState.data])

  return (
    <div className="stopcard-row-container">
      <div className="title-with-icons">
        <StopViewTitleEditor id={id} title={title} updateValue={updateTitle} />
        <div className="icons">
          <div className="delete icon" onClick={() => onCardDelete(id)}>
            <Icon img="delete" color={'#888888'} />
          </div>
          <SortableHandleItem>
            <div className="drag icon">
              <Icon img="drag" color={'#888888'} />
            </div>
          </SortableHandleItem>
        </div>
      </div>
      <div className="search-stop-with-layout-and-time">
        <div className="search-stop">
          <DTAutosuggest
            appElement={'root'}
            searchContext={getSearchContext()}
            icon="search"
            id="search"
            placeholder={t('autosuggestPlaceHolder')}
            value=""
            onSelect={onSelect}
            onClear={onClear}
            autoFocus={false}
            lang={lang}
            sources={['Datasource']}
            targets={['Stops']}
          />
        </div>
        <LayoutAndTimeContainer />
      </div>
      <div className="stop-list">
        <StopListContainer
          stops={stops}
          cardId={id}
          onStopDelete={onStopDelete}
          setStops={setStops}
        />
      </div>
    </div>
  );
};

export default withTranslation('translations')(StopCardRow);
