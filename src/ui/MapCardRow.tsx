import React, { FunctionComponent, useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../contexts';
import StopViewTitleEditor from './StopViewTitleEditor';
import { ICardInfo, IMapSettings } from '../util/Interfaces';
import Icon from './Icon';
import Toggle from './Toggle';
import LayoutAndTimeContainer from './LayoutAndTimeContainer';
import { SupportedLanguage } from '../i18n';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
  readonly cards: Array<any>;
  readonly item: ICardInfo;
  readonly onCardDelete?: (id: number) => void;
  readonly onCardMove?: (oldIndex: number, newIndex: number) => void;
  readonly updateCardInfo?: (
    cardId: number,
    type: string,
    value: string,
    lang?: string,
  ) => void;
  languages: Array<SupportedLanguage>;
  mapSettings: IMapSettings;
  updateMapSettings: (settings: IMapSettings) => void;
  openModal: () => void;
  orientation?: string;
}

const mapCardRow: FunctionComponent<IProps> = ({
  cards,
  item,
  onCardDelete,
  onCardMove,
  updateCardInfo,
  updateMapSettings,
  openModal,
  languages,
  mapSettings,
  orientation,
}) => {
  const config = useContext(ConfigContext);
  const [t] = useTranslation();
  const possibleToMove = cards.length > 1;
  const { id, index } = item;
  const richItem = {
    ...item,
    layout: orientation === 'vertical' ? 19 : 18,
  };
  const engLan = localStorage.getItem('lang') === 'en';
  const isFirst = index === 0;
  const isLast = index === cards.length - 1;
  const style = {
    '--delay-length': `0.0s`,
  } as React.CSSProperties;

  const handleToggle = hideTimeTable => {
    const newSettings = {
      ...mapSettings,
      hideTimeTable: hideTimeTable,
    };
    updateMapSettings(newSettings);
  };
  return (
    <>
      <li className="stopcard animate-in" id={`stopcard_${id}`} style={style}>
        <div className="stopcard-row-container">
          <div className="title-with-icons">
            <div className="title-list">
              {languages.map((lan, i) => {
                return (
                  <StopViewTitleEditor
                    key={`lan-${lan}`}
                    card={item}
                    updateCardInfo={updateCardInfo}
                    lang={lan}
                    isMap
                  />
                );
              })}
            </div>
            <div className="icons">
              {cards.length > 1 && (
                <button
                  type="button"
                  className={cx(
                    'delete icon',
                    possibleToMove ? '' : 'move-end',
                  )}
                  aria-label={t('deleteView', { id: `${index + 1}` })}
                  onClick={() => onCardDelete(id)}
                >
                  <Icon img="delete" color={config.colors.primary} />
                </button>
              )}
              {possibleToMove && (
                <div
                  className={cx(
                    'move icon',
                    !isFirst && !isLast ? 'up-and-down' : '',
                  )}
                >
                  {isFirst && (
                    <button
                      type="button"
                      aria-label={t('moveViewDown', {
                        id: `${index + 1}`,
                      })}
                      onClick={() => onCardMove(index, index + 1)}
                    >
                      <Icon
                        img="move-both-down"
                        color={config.colors.primary}
                        width={30}
                        height={40}
                      />
                    </button>
                  )}
                  {isLast && (
                    <button
                      type="button"
                      aria-label={t('moveViewUp', {
                        id: `${index + 1}`,
                      })}
                      onClick={() => onCardMove(index, index - 1)}
                    >
                      <Icon
                        img="move-both-up"
                        color={config.colors.primary}
                        width={30}
                        height={40}
                      />
                    </button>
                  )}
                  {!isFirst && !isLast && (
                    <div className="container">
                      <button
                        type="button"
                        aria-label={t('moveViewUp', {
                          id: `${index + 1}`,
                        })}
                        onClick={() => onCardMove(index, index - 1)}
                      >
                        <Icon
                          img="move-up"
                          color={config.colors.primary}
                          width={16}
                          height={16}
                        />
                      </button>
                      <div className="move-divider">
                        <div></div>
                      </div>
                      <button
                        type="button"
                        aria-label={t('moveViewDown', {
                          id: `${index + 1}`,
                        })}
                        onClick={() => onCardMove(index, index + 1)}
                        className="move-down"
                      >
                        <Icon
                          img="move-down"
                          color={config.colors.primary}
                          width={16}
                          height={16}
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="headers">
            <div className="stop"></div>
            <div id={`col-layout-${id}`} className="layout">
              {t('layout')}
            </div>
            <div id={`col-duration-${id}`} className="duration">
              {t('duration')}
            </div>
          </div>
          <div className="map-description">
            <Icon img="map-icon" height={48} width={48} />
            <span className="desc"> {t('map-description')} </span>
            <button
              type="button"
              className={cx('modallink', engLan ? 'eng' : '')}
              aria-haspopup="dialog"
              onClick={() => openModal()}
            >
              {' '}
              {t('edit-map')}
            </button>
            <LayoutAndTimeContainer
              orientation={orientation as 'horizontal' | 'vertical'}
              cardInfo={richItem}
              updateCardInfo={updateCardInfo}
              updateLayout={null}
              durationEditable
              allowInformationDisplay={false}
              disableLayoutButton
              layoutHeaderId={`col-layout-${id}`}
              durationHeaderId={`col-duration-${id}`}
            />
          </div>
          <div className="toggle">
            <label>
              <Toggle
                toggled={mapSettings.hideTimeTable}
                onToggle={handleToggle}
              />
              <span className="hide-timetable">{t('hide-timetable')}</span>
            </label>
          </div>
        </div>
      </li>
    </>
  );
};

export default mapCardRow;
