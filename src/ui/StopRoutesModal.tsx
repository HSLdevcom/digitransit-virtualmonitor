import cx from 'classnames';
import React, { FC, useState } from 'react';
import Button from './Button';
import Checkbox from './CheckBox';
import Dropdown from './Dropdown';
import Icon from './Icon';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IStop } from '../util/Interfaces';
import Modal from 'react-modal';
import { capitalize } from '../util/monitorUtils';
import { getColorByName, getIconStyleWithColor } from '../util/getConfig';
import { getStopIcon } from '../util/stopCardUtil';
import { isKeyboardSelectionEvent } from '../util/browser';

Modal.setAppElement('#root');

interface IRoute {
  gtfsId?: string;
  shortName?: string;
  code?: string;
}

interface Props {
  showModal: boolean;
  stop: IStop;
  closeModal: (route: IRoute[]) => void;
  stopSettings?: any;
  combinedPatterns: string[];
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

const StopRoutesModal: FC<Props & WithTranslation> = (
  props: Props & WithTranslation,
) => {
  const [showInputs, setShowInputs] = useState(false);
  const [settings, setSettings] = useState(
    props.stopSettings || defaultSettings,
  );

  const [renamings, setRenamings] = useState(
    props.stopSettings?.renamedDestinations || [],
  );
  const stopCode = props.stop.code ? `(${props.stop.code})` : '';
  const text = props.t('stopSettings', {
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
        const inputFI = document?.getElementById(`fi-${p}`) as HTMLInputElement;
        const inputSV = document?.getElementById(`sv-${p}`) as HTMLInputElement;
        const inputEN = document?.getElementById(`en-${p}`) as HTMLInputElement;
        inputFI.value = '';
        inputSV.value = '';
        inputEN.value = '';
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
            aria-label={props.t('close')}
            onClick={handleClose}
          >
            <Icon
              img="close"
              color={getColorByName('primary')}
              height={24}
              width={24}
            />
          </button>
        </section>
        <section id="section-with-side-padding">
          <div className="title-container">
            <h2 className="title">{text}</h2>
          </div>
        </section>
        <section id="section-with-side-padding">
          <h2 id="show-settings-group-label">{props.t('show')}</h2>
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
                  aria-label={`${props.t('show')} ${props.t(setting)}`}
                  margin={'0 10px 5px 0'}
                  color={getColorByName('primary')}
                >
                  {props.t(setting)}
                </Checkbox>
              </React.Fragment>
            );
          })}
        </section>
        <section id="section-with-side-padding">
          <div className="divider" />
        </section>
        <section id="section-with-side-padding" className="timeshift">
          <h2> {props.t('timeShift')}</h2>
          <p>{props.t('timeShiftDescription')}</p>
          <div className="show-departures-over">
            {props.t('timeShiftShow')}
            <Dropdown
              name="duration"
              isSearchable={false}
              options={durations}
              placeholder={settings.timeShift.toString().concat(' min')}
              handleChange={handleTimeShift}
            />
          </div>
        </section>
        <section id="section-with-side-padding">
          <div className="divider" />
        </section>
        <section
          id="section-with-side-padding"
          className="title-and-no-renaming"
        >
          <div className="title">
            <h2>
              {props.t('hideLines', {
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
              {showInputs
                ? props.t('deleteRenamings')
                : props.t('renameDestinations')}
            </h2>
          </div>
        </section>
        <section id="section-with-side-padding" className="route-rows">
          <div className="row">
            <Checkbox
              isSelected={hiddenRouteChecked(null)}
              onChange={() => checkHiddenRoute('all')}
              name={'all'}
              width={30}
              height={30}
              color={getColorByName('primary')}
              aria-label={props.t('hideAllLines')}
            >
              <span className="all">{props.t('all')}</span>
            </Checkbox>
          </div>
          {(showInputs || renamings.length > 0) && (
            <div className={cx('row', 'small')}>
              <div className="empty-space"></div>
              <div className={cx('lang', 'fi')}>FI</div>
              <div className={cx('lang', 'sv')}>SV</div>
              <div className={cx('lang', 'en')}>EN</div>
            </div>
          )}
          {props.combinedPatterns.map((pattern, index) => {
            const renamedDestination = renamings?.find(
              d => d.pattern === pattern,
            );

            const keyForInput = 3 * index + 1;
            const patternArray = pattern.split(':');
            const iconStyle = getIconStyleWithColor(getStopIcon(props.stop));

            return (
              <div key={`r-${index}`} className="row">
                <Checkbox
                  key={`c-${index}`}
                  isSelected={hiddenRouteChecked(pattern)}
                  onChange={() => checkHiddenRoute(pattern)}
                  name={pattern}
                  width={30}
                  height={30}
                  color={getColorByName('primary')}
                  aria-label={props.t('hideLine', { line: patternArray[2] })}
                >
                  <div className="vehicle">
                    <Icon
                      img={
                        !iconStyle.postfix
                          ? getStopIcon(props.stop)
                          : getStopIcon(props.stop) + iconStyle.postfix
                      }
                      width={24}
                      height={24}
                      color={iconStyle.color}
                    />
                  </div>
                  <div className="route-number">{patternArray[2]}</div>
                  {!showInputs && !renamedDestination && (
                    <div className="destination">
                      {capitalize(patternArray[3])}
                    </div>
                  )}
                  {(showInputs || renamedDestination) && (
                    <div className="renamedDestinations">
                      <input
                        key={`i-${keyForInput}`}
                        id={`fi-${pattern}`}
                        name={pattern}
                        className={cx('fi', !showInputs ? 'readonly' : '')}
                        defaultValue={
                          !showInputs && renamedDestination?.fi
                            ? renamedDestination?.fi
                            : undefined
                        }
                        onChange={e => handleRenamedDestination(e, 'fi')}
                        placeholder={patternArray[3]}
                        readOnly={!showInputs}
                      />
                      <input
                        key={`i-${keyForInput + 1}`}
                        id={`sv-${pattern}`}
                        name={pattern}
                        className={cx('sv', !showInputs ? 'readonly' : '')}
                        defaultValue={renamedDestination?.sv}
                        onChange={e => handleRenamedDestination(e, 'sv')}
                        readOnly={!showInputs}
                      />
                      <input
                        key={`i-${keyForInput + 2}`}
                        id={`en-${pattern}`}
                        name={pattern}
                        className={cx('en', !showInputs ? 'readonly' : '')}
                        defaultValue={renamedDestination?.en}
                        onChange={e => handleRenamedDestination(e, 'en')}
                        readOnly={!showInputs}
                      />
                    </div>
                  )}
                </Checkbox>
              </div>
            );
          })}
        </section>
        <section id="section-with-side-padding">
          <div className="divider-routes" />
          <div
            className={cx(
              'button-container',
              props.combinedPatterns.length < 5 ? 'less' : '',
            )}
          >
            <Button onClick={handleSave} text={props.t('save')} />
          </div>
        </section>
      </div>
    </Modal>
  );
};
export default withTranslation('translations')(StopRoutesModal);
