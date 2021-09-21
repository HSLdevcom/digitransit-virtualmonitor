import React, { FC, useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { gql, useLazyQuery } from '@apollo/client';
import { IColumn, IStop } from '../util/Interfaces';
import Icon from './Icon';
import { GET_STOP, GET_STATION } from '../queries/stopStationQueries';
import { uniqBy, sortBy } from 'lodash';
import StopViewTitleEditor from './StopViewTitleEditor';
import DTAutosuggest from '@digitransit-component/digitransit-component-autosuggest';
import { setSearchContextWithFeedIds } from './searchContext';
import LayoutAndTimeContainer from './LayoutAndTimeContainer';
import StopListContainer from './StopListContainer';
import { ICardInfo } from './CardInfo';
import cx from 'classnames';

const getGTFSId = id => {
  if (id && typeof id.indexOf === 'function' && id.indexOf('GTFS:') === 0) {
    if (id.indexOf('#') === -1) {
      return id.substring(5);
    }
    return id.substring(5, id.indexOf('#'));
  }
  return undefined;
};

interface IProps {
  readonly orientation: string;
  noStopsSelected: () => boolean;
  readonly feedIds: Array<string>;
  readonly cardsCount: number;
  readonly cardInfo: ICardInfo;
  readonly columns: Array<IColumn>;
  readonly onCardDelete?: (id: number) => void;
  readonly onCardMove?: (oldIndex: number, newIndex: number) => void;
  readonly onStopDelete?: (
    cardId: number,
    side: string,
    gtfsId: string,
  ) => void;
  readonly onStopMove?: (cardId: number, side: string, gtfsId: string) => void;
  readonly setStops?: (
    cardId: number,
    side: string,
    stops: Array<IStop>,
    reorder: boolean,
    gtfsIdForHidden: string,
  ) => void;
  readonly updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
  ) => void;
  languages: Array<string>;
}

const StopCardRow: FC<IProps & WithTranslation> = ({
  orientation,
  feedIds,
  cardsCount,
  cardInfo,
  columns,
  onCardDelete,
  onCardMove,
  onStopDelete,
  onStopMove,
  setStops,
  updateCardInfo,
  languages,
  noStopsSelected,
  t,
}) => {
  const [getStop, stopState] = useLazyQuery(GET_STOP);
  const [getStation, stationState] = useLazyQuery(GET_STATION);
  const [autosuggestValue, setAutosuggestValue] = useState(null);

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
            const routes = stop.stoptimesForPatterns.map(
              stoptimes => stoptimes.pattern,
            );
            return {
              ...stopWithGTFS,
              patterns: sortBy(
                sortBy(routes, 'route.shortName'),
                'shortName.length',
              ),
              hiddenRoutes: [],
              parentStation: stop.parentStation
                ? stop.parentStation.gtfsId
                : undefined,
              mode: stop.stoptimesForPatterns[0].pattern.route.mode,
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
            let patterns = [];

            station.stops.forEach(stop =>
              patterns.push(...stop.stoptimesForPatterns),
            );
            patterns = uniqBy(patterns, 'pattern.code');
            const stationWithGTFS = {
              ...station,
              locality: autosuggestValue.locality,
            };
            return {
              ...stationWithGTFS,
              code: t('station'),
              desc: station.stops[0].desc,
              patterns: sortBy(
                sortBy(patterns, 'pattern.route.shortname'),
                'pattern.route.shortname.length',
              ).map(e => e.pattern),
              hiddenRoutes: [],
              mode: station.stops[0].stoptimesForPatterns[0].pattern.route.mode,
            };
          }),
        false,
        undefined,
      );
    }
  }, [stationState.data]);

  const lang = t('languageCode');
  const isFirst = cardInfo.index === 0;
  const isLast = cardInfo.index === cardsCount - 1;
  const isEastWest = cardInfo.layout >= 9 && cardInfo.layout <= 11;
  return (
    <li className="stopcard" id={`stopcard_${cardInfo.id}`}>
      <div className="stopcard-row-container">
        <div className="title-with-icons">
          {languages.includes('fi') && (
            <StopViewTitleEditor
              id={cardInfo.id}
              layout={cardInfo.layout}
              title={cardInfo.title}
              updateCardInfo={updateCardInfo}
              lang={'fi'}
            />
          )}
          {languages.includes('sv') &&
            (!isEastWest || !languages.includes('fi')) && (
              <StopViewTitleEditor
                id={cardInfo.id}
                layout={cardInfo.layout}
                title={cardInfo.title}
                updateCardInfo={updateCardInfo}
                lang={'sv'}
              />
            )}
          {languages.includes('en') &&
            (!isEastWest ||
              (!languages.includes('fi') && !languages.includes('sv'))) && (
              <StopViewTitleEditor
                id={cardInfo.id}
                layout={cardInfo.layout}
                title={cardInfo.title}
                updateCardInfo={updateCardInfo}
                lang={'en'}
              />
            )}
          <div className="icons">
            {cardsCount > 1 && (
              <div
                className={cx(
                  'delete icon',
                  cardInfo.possibleToMove ? '' : 'move-end',
                )}
                onClick={() => onCardDelete(cardInfo.id)}
              >
                <Icon img="delete" color={'#007AC9'} />
              </div>
            )}
            {cardInfo.possibleToMove && (
              <div
                className={cx(
                  'move icon',
                  !isFirst && !isLast ? 'up-and-down' : '',
                )}
              >
                {isFirst && (
                  <div
                    onClick={() =>
                      onCardMove(cardInfo.index, cardInfo.index + 1)
                    }
                  >
                    <Icon
                      img="move-both-down"
                      color={'#007AC9'}
                      width={30}
                      height={40}
                    />
                  </div>
                )}
                {isLast && (
                  <div
                    onClick={() =>
                      onCardMove(cardInfo.index, cardInfo.index - 1)
                    }
                  >
                    <Icon
                      img="move-both-up"
                      color={'#007AC9'}
                      width={30}
                      height={40}
                    />
                  </div>
                )}
                {!isFirst && !isLast && (
                  <div className="container">
                    <div
                      onClick={() =>
                        onCardMove(cardInfo.index, cardInfo.index - 1)
                      }
                    >
                      <Icon
                        img="move-up"
                        color={'#007AC9'}
                        width={16}
                        height={16}
                      />
                    </div>
                    <div className="move-divider">
                      <div></div>
                    </div>
                    <div
                      onClick={() =>
                        onCardMove(cardInfo.index, cardInfo.index + 1)
                      }
                      className="move-down"
                    >
                      <Icon
                        img="move-down"
                        color={'#007AC9'}
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="headers">
          <div className="stop">{t('prepareStop')}</div>
          <div className="layout">{t('layout')}</div>
          <div className="duration">
            {cardInfo.possibleToMove ? t('duration') : ''}
          </div>
        </div>
        <div className="search-stop-with-layout-and-time">
          <div className="search-stop">
            {noStopsSelected() && (
              <div className="add-stop-alert">{t('add-at-least-one-stop')}</div>
            )}
            <DTAutosuggest
              appElement={'root'}
              searchContext={setSearchContextWithFeedIds(feedIds)}
              icon="search"
              id={'search'}
              placeholder={'autosuggestPlaceHolder'}
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
            orientation={orientation}
            cardInfo={cardInfo}
            updateCardInfo={updateCardInfo}
          />
        </div>
        <StopListContainer
          stops={columns}
          onStopDelete={onStopDelete}
          onStopMove={onStopMove}
          setStops={setStops}
          cardInfo={cardInfo}
          updateCardInfo={updateCardInfo}
          languages={languages}
        />
      </div>
    </li>
  );
};

export default withTranslation('translations')(StopCardRow);
