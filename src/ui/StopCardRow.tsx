import React, { FC, useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { gql, useLazyQuery } from '@apollo/client';
import Icon from './Icon';
import { uniqBy, sortBy } from 'lodash';
import StopViewTitleEditor from './StopViewTitleEditor';
import DTAutosuggest from '@digitransit-component/digitransit-component-autosuggest';
import getSearchContext from './searchContext';
import LayoutAndTimeContainer from './LayoutAndTimeContainer';
import StopListContainer from './StopListContainer';
import { SortableHandle } from 'react-sortable-hoc';
import { ICardInfo } from './CardInfo';
import cx from 'classnames';
import { focusToInput, onClick } from './InputUtils';
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
      locationType
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
      locationType
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
  readonly cardInfo: ICardInfo;
  readonly columns: any;
  readonly onCardDelete?: (id: number) => void;
  readonly onStopDelete?: (
    cardId: number,
    side: string,
    gtfsId: string,
  ) => void;
  readonly setStops?: (
    cardId: number,
    side: string,
    stops: any,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => void;
  readonly updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
  ) => void;
}

const StopCardRow: FC<IProps & WithTranslation> = ({
  cardInfo,
  columns,
  onCardDelete,
  onStopDelete,
  setStops,
  updateCardInfo,
  t,
}) => {
  const [getStop, stopState] = useLazyQuery(GET_STOP);
  const [getStation, stationState] = useLazyQuery(GET_STATION);
  const [newTitleLeft, setNewTitleLeft] = useState(columns['left'].title);
  const [changedLeft, setChangedLeft] = useState(false);
  const [newTitleRight, setNewTitleRight] = useState(columns['right'].title);
  const [changedRight, setChangedRight] = useState(false);
  const [autosuggestValue, setAutosuggestValue] = useState(undefined);

  const onBlur = (event: any, side: string) => {
    if (event && updateCardInfo) {
      updateCardInfo(cardInfo.id, `title-${side}`, event.target.value);
      if (side === 'left') {
        setChangedLeft(false);
      } else {
        setChangedRight(false);
      }
    }
  };

  const isKeyboardSelectionEvent = (event: any, side: string) => {
    const backspace = [8, 'Backspace'];
    const space = [13, ' ', 'Spacebar'];
    const enter = [32, 'Enter'];

    const key = (event && (event.key || event.which || event.keyCode)) || '';

    const newTitle = side === 'left' ? newTitleLeft : newTitleRight;

    if (
      key &&
      typeof event.target.selectionStart === 'number' &&
      event.target.selectionStart === 0 &&
      event.target.selectionEnd === event.target.value.length &&
      newTitle
    ) {
      if (backspace.concat(space).includes(key)) {
        if (side === 'left') {
          setNewTitleLeft('');
          setChangedLeft(true);
        } else {
          setNewTitleRight('');
          setChangedRight(true);
        }
      } else if (key.length === 1) {
        event.target.value = key;
        if (side === 'left') {
          setNewTitleLeft(key);
          setChangedLeft(true);
        } else {
          setNewTitleRight(key);
          setChangedRight(true);
        }
      }
      return false;
    }

    if (key && backspace.includes(key)) {
      if (side === 'left') {
        setNewTitleLeft(newTitleLeft.slice(0, -1));
        setChangedLeft(true);
      } else {
        setNewTitleRight(newTitleRight.slice(0, -1));
        setChangedRight(true);
      }
      return false;
    }

    if (!key || !enter.includes(key)) {
      if (key.length === 1) {
        if (side === 'left') {
          setNewTitleLeft(newTitleLeft.concat(key));
          setChangedLeft(true);
        } else {
          setNewTitleRight(newTitleRight ? newTitleRight.concat(key) : key);
          setChangedRight(true);
        }
      }
      return false;
    }

    event.preventDefault();
    if (updateCardInfo) {
      updateCardInfo(
        cardInfo.id,
        `title-${side}`,
        side === 'left' ? newTitleLeft : newTitleRight ? newTitleRight : '',
      );
      if (side === 'left') {
        setChangedLeft(false);
      } else {
        setChangedRight(false);
      }
    }
    return true;
  };

  const onSelect = selected => {
    const properties = selected.properties;
    setAutosuggestValue(properties);
    switch (properties.layer) {
      case 'stop':
        getStop({ variables: { ids: getGTFSId(properties.id) } });
        break;
      case 'station':
        getStation({ variables: { ids: getGTFSId(properties.id) } });
        break;
      default:
        break;
    }
  };

  const onClear = () => {
    return null;
  };

  useEffect(() => {
    if (stopState.data?.stop) {
      setStops(
        cardInfo.id,
        'left',
        stopState.data.stop
          .filter(
            stop =>
              stop && !columns['left'].stops.some(el => el.id === stop.id),
          )
          .map(stop => {
            const stopWithGTFS = {
              ...stop,
              locality: autosuggestValue.locality,
            };
            return {
              ...stopWithGTFS,
              routes: sortBy(
                sortBy(stop.routes, 'shortName'),
                'shortName.length',
              ),
              hiddenRoutes: [],
            };
          }),
        false,
        undefined,
      );
    }
  }, [stopState.data]);

  useEffect(() => {
    if (stationState.data?.station) {
      setStops(
        cardInfo.id,
        'left',
        stationState.data.station
          .filter(s => s && !columns['left'].stops.some(el => el.id === s.id))
          .map(station => {
            let routes = [];
            station.stops.forEach(stop => routes.push(...stop.routes));
            routes = uniqBy(routes, 'gtfsId');
            const stationWithGTFS = {
              ...station,
              locality: autosuggestValue.locality,
            };
            return {
              ...stationWithGTFS,
              code: t('station'),
              desc: station.stops[0].desc,
              routes: sortBy(sortBy(routes, 'shortName'), 'shortName.length'),
              hiddenRoutes: [],
            };
          }),
        false,
        undefined,
      );
    }
  }, [stationState.data]);

  const lang = t('languageCode');
  const SortableHandleItem = SortableHandle(({ children }) => children);
  const showStopTitles = columns['left'].stops.length > 0;
  return (
    <div className="stopcard-row-container">
      <div className="title-with-icons">
        <StopViewTitleEditor
          id={cardInfo.id}
          title={cardInfo.title}
          updateCardInfo={updateCardInfo}
        />
        <div className="icons">
          <div
            className="delete icon"
            onClick={() => onCardDelete(cardInfo.id)}
          >
            <Icon img="delete" color={'#888888'} />
          </div>
          <SortableHandleItem>
            <div className="drag icon">
              <Icon img="drag" color={'#888888'} />
            </div>
          </SortableHandleItem>
        </div>
      </div>
      <div className="headers">
        <div className="stop">{t('prepareStop')}</div>
        <div className="layout">{t('layout')}</div>
        <div className="duration">{t('duration')}</div>
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
        <LayoutAndTimeContainer
          cardInfo={cardInfo}
          updateCardInfo={updateCardInfo}
        />
      </div>
      {cardInfo.layout >= 9 && showStopTitles && (
        <div className={cx('stop-list-title', 'left')}>
          <input
            className="input-left"
            id={'stop-list-title-input-left'}
            onClick={e => onClick(e)}
            onKeyDown={e => isKeyboardSelectionEvent(e, 'left')}
            onBlur={e =>
              !isKeyboardSelectionEvent(e, 'left') && onBlur(e, 'left')
            }
            value={changedLeft ? newTitleLeft : columns['left'].title}
          />
          <div
            role="button"
            onClick={() => focusToInput('stop-list-title-input-left')}
          >
            <Icon img="edit" color={'#007ac9'} width={20} height={20} />
          </div>
        </div>
      )}
      <div className="stop-list">
        <StopListContainer
          side={'left'}
          stops={columns}
          cardId={cardInfo.id}
          layout={cardInfo.layout}
          onStopDelete={onStopDelete}
          setStops={setStops}
        />
      </div>
      {cardInfo.layout >= 9 && showStopTitles && (
        <div className={cx('stop-list-title', 'right')}>
          <input
            className="input-right"
            id={'stop-list-title-input-right'}
            onClick={e => onClick(e)}
            onKeyDown={e => isKeyboardSelectionEvent(e, 'right')}
            onBlur={e =>
              !isKeyboardSelectionEvent(e, 'right') && onBlur(e, 'right')
            }
            value={changedRight ? newTitleRight : columns['right'].title}
          />
          <div
            role="button"
            onClick={() => focusToInput('stop-list-title-input-right')}
          >
            <Icon img="edit" color={'#007ac9'} width={20} height={20} />
          </div>
        </div>
      )}
      {cardInfo.layout >= 9 &&
        showStopTitles &&
        columns['right'].stops.length === 0 && (
          <div className="stop-list">
            <ul className="stops">
              <li className="stop">
                <div className="stop-row-container">
                  <div className="drag-and-drop-placeholder">
                    {t('drag-and-drop-placeholder', {
                      title: columns['left'].title,
                    })}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        )}
      {cardInfo.layout >= 9 && columns['right'].stops.length > 0 && (
        <div className="stop-list">
          <StopListContainer
            side={'right'}
            stops={columns}
            cardId={cardInfo.id}
            layout={cardInfo.layout}
            onStopDelete={onStopDelete}
            setStops={setStops}
          />
        </div>
      )}
    </div>
  );
};

export default withTranslation('translations')(StopCardRow);
