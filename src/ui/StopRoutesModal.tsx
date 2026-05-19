import cx from 'classnames';
import uniqueId from 'lodash/uniqueId';
import React, { FC, useContext, useRef, useState } from 'react';
import Button from './Button';
import Checkbox from './CheckBox';
import Dropdown from './Dropdown';
import Icon from './Icon';
import { useTranslation } from 'react-i18next';
import { IStopInfoPlus, IRoute } from '../util/Interfaces';
import Modal from 'react-modal';
import { getRouteMode } from '../util/stopCardUtil';
import { isKeyboardSelectionEvent } from '../util/browser';
import { ConfigContext } from '../contexts';
import { getRenameDestinationId } from '../util/headsignUtils';
import { SupportedLanguage } from '../i18n';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

interface Props {
  showModal: boolean;
  stop: IStopInfoPlus;
  closeModal: (route: IRoute[]) => void;
  stopSettings?: any;
  combinedPatterns: string[];
  languages: Array<string>;
  ariaHideApp?: boolean; // For unit testing
}
export const defaultSettings = {
  hiddenRoutes: [],
  allRoutesHidden: false,
  showStopNumber: false,
  showEndOfLine: false,
  timeShift: 0,
  renamedDestinations: [],
  showVia: true,
  showRouteColumn: true,
};

const StopRoutesModal: FC<Props> = props => {
  const config = useContext(ConfigContext);
  const [t] = useTranslation();
  const [showInputs, setShowInputs] = useState(false);
  const [settings, setSettings] = useState(
    props.stopSettings || defaultSettings,
  );

  const [renamings, setRenamings] = useState(
    props.stopSettings?.renamedDestinations || [],
  );

  const titleIdRef = useRef<string>(uniqueId('stop-routes-modal-title-'));
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stopCode = props.stop.code ? `(${props.stop.code})` : '';
  const text = t('stopSettings', {
    stop: props.stop.name,
    code: stopCode,
  });

  const checkShowSetting = setting => {
    let newSettings;
    if (setting === 'showStopNumber') {
      newSettings = {
        ...settings,
        showStopNumber: !settings.showStopNumber,
      };
    } else if (setting === 'showEndOfLine') {
      newSettings = {
        ...settings,
        showEndOfLine: !settings.showEndOfLine,
      };
    } else if (setting === 'showVia') {
      newSettings = {
        ...settings,
        showVia: !settings.showVia,
      };
    } else if (setting === 'showRouteColumn') {
      newSettings = {
        ...settings,
        showRouteColumn: !settings.showRouteColumn,
      };
    }
    setSettings(newSettings);
  };

  const checkHiddenRoute = option => {
    if (option === 'all') {
      const routes =
        settings.hiddenRoutes.length === props.combinedPatterns.length
          ? []
          : props.combinedPatterns;
      setSettings({
        ...settings,
        hiddenRoutes: routes,
        allRoutesHidden: routes.length > 0,
      });
    } else if (option) {
      if (settings.hiddenRoutes.includes(option)) {
        setSettings({
          ...settings,
          hiddenRoutes: settings.hiddenRoutes.filter(r => r !== option),
          allRoutesHidden:
            settings.hiddenRoutes.length - 1 === props.combinedPatterns.length,
        });
      } else {
        setSettings({
          ...settings,
          hiddenRoutes: [...settings.hiddenRoutes, option],
          allRoutesHidden:
            settings.hiddenRoutes.length + 1 === props.combinedPatterns.length,
        });
      }
    }
    if (settings.hiddenRoutes.length !== props.combinedPatterns.length) {
      const input = document?.getElementById('all') as HTMLInputElement;
      if (input) {
        input.checked = false;
      }
    }
  };

  const handleRenamedDestination = (e, lang) => {
    const index = renamings.findIndex(r => r.pattern === e.target.name);
    if (index !== -1) {
      const updated = [...renamings];
      updated.splice(index, 1, {
        ...renamings[index],
        [lang]: e.target.value,
      });
      setRenamings(updated);
    } else {
      const empty = {
        pattern: '',
        en: '',
        fi: '',
        sv: '',
      };
      const renamedDestination = {
        ...empty,
        pattern: e.target.name,
        [lang]: e.target.value,
      };
      setRenamings([...renamings, renamedDestination]);
    }
  };

  const handleDeleteRenamings = event => {
    if (event === null || isKeyboardSelectionEvent(event, true)) {
      setRenamings([]);
      setShowInputs(false);
    }
  };

  const handleSave = () => {
    const settingsToSave = {
      ...settings,
      renamedDestinations: renamings.filter(f => f.fi + f.sv + f.en !== ''),
    };
    props.closeModal?.(settingsToSave);
  };

  const handleClose = () => {
    props.closeModal?.(null);
  };

  const hiddenRouteChecked = route => {
    if (!route) {
      return settings.hiddenRoutes.length === props.combinedPatterns.length;
    }
    return settings.hiddenRoutes.includes(route);
  };

  const handleTimeShift = option => {
    setSettings({ ...settings, timeShift: option.value });
  };

  const handleShowInputs = event => {
    if (event === null || isKeyboardSelectionEvent(event, true)) {
      setShowInputs(true);
    }
  };

  const durations = [
    { value: 0, label: '0 min' },
    { value: 1, label: '1 min' },
    { value: 2, label: '2 min' },
    { value: 3, label: '3 min' },
    { value: 4, label: '4 min' },
    { value: 5, label: '5 min' },
    { value: 6, label: '6 min' },
    { value: 7, label: '7 min' },
    { value: 8, label: '8 min' },
    { value: 9, label: '9 min' },
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
    { value: 20, label: '20 min' },
    { value: 25, label: '25 min' },
    { value: 30, label: '30 min' },
  ];

  const showSettings = [
    'showRouteColumn',
    'showStopNumber',
    'showEndOfLine',
    'showVia',
  ] as const;

  return (
    <Modal
      isOpen={props.showModal}
      onRequestClose={handleClose}
      portalClassName="modal-stop-routes"
      ariaHideApp={props.ariaHideApp ?? true}
      aria={{ labelledby: titleIdRef.current, modal: true }}
      onAfterOpen={() => titleRef.current?.focus()}
    >
      <div className="modal">
        <div className="modal-close-container">
          <button
            className="close-button"
            aria-label={t('close')}
            onClick={handleClose}
          >
            <Icon
              img="close"
              color={config.colors.primary}
              height={24}
              width={24}
            />
          </button>
        </div>
        <div className="section-margin-large">
          <div className="title-container">
            <h2
              ref={titleRef}
              id={titleIdRef.current}
              className="title"
              tabIndex={-1}
            >
              {text}
            </h2>
          </div>
        </div>
        <fieldset className="section-margin-large">
          <legend>{t('show')}</legend>
          {showSettings.map(setting => {
            return (
              <React.Fragment key={`setting-${setting}`}>
                <Checkbox
                  width={30}
                  height={30}
                  name={setting}
                  isSelected={
                    settings && settings[setting] ? settings[setting] : false
                  }
                  onChange={() => checkShowSetting(setting)}
                  aria-label={`${t('show')} ${t(setting)}`}
                  color={config.colors.primary}
                >
                  {t(setting)}
                </Checkbox>
              </React.Fragment>
            );
          })}
        </fieldset>
        <div className="section-margin-small">
          <div className="divider" />
        </div>
        <section
          className="section-margin-large timeshift"
          aria-labelledby="timeshift-heading"
        >
          <h3 id="timeshift-heading">{t('timeShift')}</h3>
          <p>{t('timeShiftDescription')}</p>
          <div className="show-departures-over">
            <span id="timeshift-show-label">{t('timeShiftShow')}</span>
            <Dropdown
              name="duration"
              options={durations}
              placeholder={settings.timeShift.toString().concat(' min')}
              handleChange={handleTimeShift}
              aria-labelledby="timeshift-show-label"
            />
          </div>
        </section>
        <div className="section-margin-small">
          <div className="divider" />
        </div>
        <div className="section-margin-large title-and-no-renaming">
          <div className="title">
            <h3 id="hide-routes-heading">
              <span aria-live="polite" aria-atomic="true">
                {t('hideLines', {
                  hidden: settings.hiddenRoutes.length,
                  all: props.combinedPatterns.length,
                })}
              </span>
            </h3>
          </div>
          <div className="no-renaming">
            <button
              className="rename-destinations-button"
              aria-expanded={showInputs}
              aria-controls="rename-destination-inputs"
              onClick={() =>
                showInputs
                  ? handleDeleteRenamings(null)
                  : handleShowInputs(null)
              }
            >
              {showInputs ? t('deleteRenamings') : t('renameDestinations')}
            </button>
          </div>
        </div>
        <div
          role="group"
          aria-labelledby="hide-routes-heading"
          id="rename-destination-inputs"
          className="section-margin-large route-rows"
        >
          <div className="row">
            <Checkbox
              isSelected={hiddenRouteChecked(null)}
              onChange={() => checkHiddenRoute('all')}
              name={'all'}
              width={30}
              height={30}
              color={config.colors.primary}
              aria-label={t('all') + ' — ' + t('hideAllLines')}
            >
              <span className="all">{t('all')}</span>
            </Checkbox>
          </div>
          {props.languages.length > 1 && (
            <div className={cx('row', 'small')}>
              <div className="empty-space"></div>
              {props.languages.map(lang => (
                <div key={lang} className={cx('lang', lang)}>
                  {lang.toUpperCase()}
                </div>
              ))}
            </div>
          )}
          {props.combinedPatterns.map(pattern => {
            const patternArray = pattern.split(':');
            const gtfsID = [patternArray[0], patternArray[1]].join(':');
            const renameId = getRenameDestinationId(patternArray[3], gtfsID);
            const renamedDestination = renamings?.find(d => {
              return d.pattern === renameId;
            });

            const { route } = props.stop.patterns.find(
              p => p.route.gtfsId === gtfsID,
            );
            const alternateIcon = config.modeIcons.postfix;
            return (
              <div key={pattern} className="row">
                <div className="routeInfo">
                  <Checkbox
                    isSelected={hiddenRouteChecked(pattern)}
                    onChange={() => checkHiddenRoute(pattern)}
                    name={pattern}
                    width={30}
                    height={30}
                    color={config.colors.primary}
                    aria-label={`${t(
                      `transport-mode-${getRouteMode(route, config)}`,
                      { defaultValue: getRouteMode(route, config) },
                    )} — ${t('hideLine', { line: patternArray[2] })}`}
                  >
                    <div className="vehicle">
                      <Icon
                        img={
                          !alternateIcon
                            ? getRouteMode(route, config)
                            : getRouteMode(route, config) + alternateIcon
                        }
                        width={24}
                        height={24}
                        color={
                          config.modeIcons.colors[
                            `mode-${getRouteMode(route, config)}`
                          ]
                        }
                      />
                    </div>
                    <div className="route-number">{patternArray[2]}</div>
                  </Checkbox>
                </div>
                <div className="renamedDestinations">
                  {props.languages.map(lang => (
                    <input
                      key={`${lang}-${renameId}`}
                      id={`${lang}-${renameId}`}
                      name={renameId}
                      className={cx(lang, !showInputs ? 'readonly' : '')}
                      value={renamedDestination?.[lang] ?? ''}
                      onChange={e => handleRenamedDestination(e, lang)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const focusable =
                            'button, [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
                          const all = Array.from(
                            document.querySelectorAll<HTMLElement>(focusable),
                          );
                          const idx = all.indexOf(e.target as HTMLElement);
                          all[idx + 1]?.focus();
                        }
                      }}
                      placeholder={patternArray[3]}
                      readOnly={!showInputs}
                      aria-label={t('renameDestinationFor', {
                        line: patternArray[2],
                        lang: t(`language-name-${lang as SupportedLanguage}`),
                      })}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="section-margin-small">
          <div className="divider-routes" />
          <div className="button-container">
            <Button onClick={handleSave} text={t('save')} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default StopRoutesModal;
