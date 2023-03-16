import React, { FunctionComponent, useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '../contexts';
import { isKeyboardSelectionEvent } from '../util/browser';
import StopViewTitleEditor from './StopViewTitleEditor';
import { ICardInfo } from '../util/Interfaces';
import Icon from './Icon';
import Toggle from './Toggle';
import LayoutAndTimeContainer from './LayoutAndTimeContainer';

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
  languages: Array<string>;
  mapSettings: any;
  updateMapSettings: (settings: any) => void;
  openModal: any;
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
    layout: orientation === 'vertical' ? 1 : 18,
  };
  const isFirst = index === 0;
  const isLast = index === cards.length - 1;
  const style = {
    '--delayLength': `0.0s`,
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
                  />
                );
              })}
            </div>
            <div className="icons">
              {cards.length > 1 && (
                <div
                  className={cx(
                    'delete icon',
                    possibleToMove ? '' : 'move-end',
                  )}
                  tabIndex={0}
                  role="button"
                  aria-label={t('deleteView', { id: `${index + 1}` })}
                  onClick={() => onCardDelete(id)}
                  onKeyPress={e =>
                    isKeyboardSelectionEvent(e, true) && onCardDelete(id)
                  }
                >
                  <Icon img="delete" color={config.colors.primary} />
                </div>
              )}
              {possibleToMove && (
                <div
                  className={cx(
                    'move icon',
                    !isFirst && !isLast ? 'up-and-down' : '',
                  )}
                >
                  {isFirst && (
                    <div
                      tabIndex={0}
                      role="button"
                      aria-label={t('moveViewDown', {
                        id: `${index + 1}`,
                      })}
                      onClick={() => onCardMove(index, index + 1)}
                      onKeyPress={e =>
                        isKeyboardSelectionEvent(e, true) &&
                        onCardMove(index, index + 1)
                      }
                    >
                      <Icon
                        img="move-both-down"
                        color={config.colors.primary}
                        width={30}
                        height={40}
                      />
                    </div>
                  )}
                  {isLast && (
                    <div
                      tabIndex={0}
                      role="button"
                      aria-label={t('moveViewUp', {
                        id: `${index + 1}`,
                      })}
                      onClick={() => onCardMove(index, index - 1)}
                      onKeyPress={e =>
                        isKeyboardSelectionEvent(e, true) &&
                        onCardMove(index, index - 1)
                      }
                    >
                      <Icon
                        img="move-both-up"
                        color={config.colors.primary}
                        width={30}
                        height={40}
                      />
                    </div>
                  )}
                  {!isFirst && !isLast && (
                    <div className="container">
                      <div
                        tabIndex={0}
                        role="button"
                        aria-label={t('moveViewUp', {
                          id: `${index + 1}`,
                        })}
                        onClick={() => onCardMove(index, index - 1)}
                        onKeyPress={e =>
                          isKeyboardSelectionEvent(e, true) &&
                          onCardMove(index, index - 1)
                        }
                      >
                        <Icon
                          img="move-up"
                          color={config.colors.primary}
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="move-divider">
                        <div></div>
                      </div>
                      <div
                        tabIndex={0}
                        role="button"
                        aria-label={t('moveViewDown', {
                          id: `${index + 1}`,
                        })}
                        onClick={() => onCardMove(index, index + 1)}
                        onKeyPress={e =>
                          isKeyboardSelectionEvent(e, true) &&
                          onCardMove(index, index + 1)
                        }
                        className="move-down"
                      >
                        <Icon
                          img="move-down"
                          color={config.colors.primary}
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
            <div className="stop"></div>
            <div className="layout">{t('layout')}</div>
            <div className="duration">{t('duration')}</div>
          </div>
          <div className="map-description">
            <Icon img="map-icon" height={48} width={48} />
            <span className="desc"> {t('map-description')} </span>
            <span
              className="modallink"
              role="button"
              onClick={() => openModal()}
            >
              {' '}
              {t('edit-map')}
            </span>
            <LayoutAndTimeContainer
              orientation={orientation}
              cardInfo={richItem}
              updateCardInfo={updateCardInfo}
              updateLayout={null}
              durationEditable
              allowInformationDisplay={false}
              disableLayoutButton
            />
          </div>
          <div className="toggle">
            <label>
              <Toggle
                toggled={mapSettings.hideTimeTable}
                onToggle={handleToggle}
              />
            </label>
            <span className="hide-timetable">{t('hide-timetable')}</span>
          </div>
        </div>
      </li>
    </>
  );
};

export default mapCardRow;
