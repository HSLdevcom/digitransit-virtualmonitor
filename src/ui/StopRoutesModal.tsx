import cx from 'classnames';
import React, { FC, useContext, useState } from 'react';
import Button from './Button';
import Checkbox from './CheckBox';
import Dropdown from './Dropdown';
import Icon from './Icon';
import { useTranslation } from 'react-i18next';
import { IStopInfoPlus, IPattern, IRoute } from '../util/Interfaces';
import Modal from 'react-modal';
import { getRouteMode } from '../util/stopCardUtil';
import { isKeyboardSelectionEvent } from '../util/browser';
import { ConfigContext } from '../contexts';
import { getRenameDestinationId } from '../util/headsignUtils';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

interface Props {
  showModal: boolean;
  stop: IStopInfoPlus;
  closeModal: (route: IRoute[]) => void;
  stopSettings?: any;
  combinedPatterns: string[];
  languages: Array<string>;
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
      renamings.splice(index, 1, {
        ...renamings[index],
        [lang]: e.target.value,
      });
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
      props.combinedPatterns.forEach(p => {
        const patArr = p.split(':');
        const gtfsID = [patArr[0], patArr[1]].join(':');
        const renameDestId = getRenameDestinationId(patArr[3], gtfsID);
        const inputFI = document?.getElementById(
          `fi-${renameDestId}`,
        ) as HTMLInputElement;
        const inputSV = document?.getElementById(
          `sv-${renameDestId}`,
        ) as HTMLInputElement;
        const inputEN = document?.getElementById(
          `en-${renameDestId}`,
        ) as HTMLInputElement;
        if (inputFI) inputFI.value = '';
        if (inputSV) inputSV.value = '';
        if (inputEN) inputEN.value = '';
      });
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
  ];

  return (
    <Modal
      isOpen={props.showModal}
      onRequestClose={handleClose}
      portalClassName="modal-stop-routes"
    >
      <div className="modal">
        <section id="close">
          <button
            className="close-button"
            role="button"
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
        </section>
        <section className="section-margin-large">
          <div className="title-container">
            <h2 className="title">{text}</h2>
          </div>
        </section>
        <section className="section-margin-large">
          <h2 id="show-settings-group-label">{t('show')}</h2>
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
        </section>
        <section className="section-margin-small">
          <div className="divider" />
        </section>
        <section className="section-margin-large timeshift">
          <h2> {t('timeShift')}</h2>
          <p>{t('timeShiftDescription')}</p>
          <div className="show-departures-over">
            {t('timeShiftShow')}
            <Dropdown
              name="duration"
              options={durations}
              placeholder={settings.timeShift.toString().concat(' min')}
              handleChange={handleTimeShift}
            />
          </div>
        </section>
        <section className="section-margin-small">
          <div className="divider" />
        </section>
        <section className="section-margin-large title-and-no-renaming">
          <div className="title">
            <h2>
              {t('hideLines', {
                hidden: settings.hiddenRoutes.length,
                all: props.combinedPatterns.length,
              })}
            </h2>
          </div>
          <div className="no-renaming">
            <h2
              role="button"
              tabIndex={0}
              onClick={() =>
                showInputs
                  ? handleDeleteRenamings(null)
                  : handleShowInputs(null)
              }
              onKeyPress={e =>
                showInputs ? handleDeleteRenamings(e) : handleShowInputs(e)
              }
            >
              {showInputs ? t('deleteRenamings') : t('renameDestinations')}
            </h2>
          </div>
        </section>
        <section className="section-margin-large route-rows">
          <div className="row">
            <Checkbox
              isSelected={hiddenRouteChecked(null)}
              onChange={() => checkHiddenRoute('all')}
              name={'all'}
              width={30}
              height={30}
              color={config.colors.primary}
              aria-label={t('hideAllLines')}
            >
              <span className="all">{t('all')}</span>
            </Checkbox>
          </div>
          {props.languages.length > 1 && (
            <div className={cx('row', 'small')}>
              <div className="empty-space"></div>
              {props.languages.map(lang => (
                <div className={cx('lang', lang)}>{lang.toUpperCase()}</div>
              ))}
            </div>
          )}
          {props.combinedPatterns.map((pattern, index) => {
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
                    aria-label={t('hideLine', { line: patternArray[2] })}
                  >
                    <div className="vehicle">
                      <Icon
                        img={
                          !alternateIcon
                            ? getRouteMode(route)
                            : getRouteMode(route) + alternateIcon
                        }
                        width={24}
                        height={24}
                        color={
                          config.modeIcons.colors[`mode-${getRouteMode(route)}`]
                        }
                      />
                    </div>
                    <div className="route-number">{patternArray[2]}</div>
                  </Checkbox>
                </div>
                <div className="renamedDestinations">
                  {props.languages.map(lang => (
                    <input
                      tabIndex={showInputs ? 1 : -1}
                      key={`${lang}-${renameId}`}
                      id={`${lang}-${renameId}`}
                      name={renameId}
                      className={cx(lang, !showInputs ? 'readonly' : '')}
                      defaultValue={
                        renamedDestination?.[lang]
                          ? renamedDestination[lang]
                          : undefined
                      }
                      onChange={e => handleRenamedDestination(e, lang)}
                      placeholder={patternArray[3]}
                      readOnly={!showInputs}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
        <section className="section-margin-small">
          <div className="divider-routes" />
          <div className="button-container">
            <Button onClick={handleSave} text={t('save')} />
          </div>
        </section>
      </div>
    </Modal>
  );
};
export default StopRoutesModal;
