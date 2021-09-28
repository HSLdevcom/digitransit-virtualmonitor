import cx from 'classnames';
import React, { FC, useState } from 'react';
import Button from './Button';
import Checkbox from './CheckBox';
import Dropdown from './Dropdown';
import Icon from './Icon';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IStopInfo } from './StopInfoRetriever';
import { v4 as uuid } from 'uuid';
import Modal from 'react-modal';
import { capitalize } from '../util/monitorUtils';
Modal.setAppElement('#root');

interface IRoute {
  gtfsId?: string;
  shortName?: string;
  code?: string;
}

interface Props {
  showModal: boolean;
  stop: IStopInfo;
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

  const text = props.t('showHidden', {
    stop: props.stop.name,
    code: props.stop.code,
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

  const handleDeleteRenamings = () => {
    props.combinedPatterns.forEach(p => {
      const inputFI = document?.getElementById(`fi-${p}`) as HTMLInputElement;
      const inputSV = document?.getElementById(`sv-${p}`) as HTMLInputElement;
      const inputEN = document?.getElementById(`en-${p}`) as HTMLInputElement;
      inputFI.value = '';
      inputSV.value = '';
      inputEN.value = '';
    });
    setRenamings([]);
  };

  const handleClose = () => {
    const settingsToSave = {
      ...settings,
      renamedDestinations: renamings.filter(f => f.fi + f.sv + f.en !== ''),
    };
    props.closeModal?.(settingsToSave);
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

  const handleShowInputs = () => {
    setShowInputs(true);
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
  const vehicleMode = props.stop.vehicleMode
    ? props.stop.vehicleMode.toLowerCase()
    : 'bus';

  const renamedDestinations = renamings;

  return (
    <Modal
      isOpen={props.showModal}
      onRequestClose={handleClose}
      portalClassName="modal-stop-routes"
    >
      <div className="modal">
        <div className="title-container">
          <span className="title"> {text} </span>
        </div>
        <div className="show-settings">
          <h2> {props.t('show')}</h2>
          <div className="setting">
            <Checkbox
              checked={settings.showStopNumber}
              onChange={checkShowSetting}
              name={'showStopNumber'}
              width={30}
              height={30}
            />{' '}
            <span className="setting-text">
              {props.t('stopCodeOrPlatformNumber')}
            </span>
          </div>
          <div className="setting">
            <Checkbox
              checked={settings.showEndOfLine}
              onChange={checkShowSetting}
              name={'showEndOfLine'}
              width={30}
              height={30}
            />{' '}
            <span className={'setting-text'}>{props.t('endOfLine')}</span>
          </div>
          <div className="setting">
            <Checkbox
              checked={settings.showVia}
              onChange={checkShowSetting}
              name={'showVia'}
              width={30}
              height={30}
            />{' '}
            <span className={'setting-text'}>{props.t('showVia')}</span>
          </div>
        </div>
        <div className="divider" />
        <div className="timeshift">
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
        </div>
        <div className="divider" />
        <div className="title-and-no-renaming">
          <div className="title">
            <h2>
              {props.t('hideLines')}
              {settings.hiddenRoutes.length
                .toString()
                .concat(' / ')
                .concat(props.combinedPatterns.length)}
            </h2>
          </div>
          <div
            className="no-renaming"
            onClick={showInputs ? handleDeleteRenamings : handleShowInputs}
          >
            <h2>
              {showInputs
                ? props.t('deleteRenamings')
                : props.t('renameDestinations')}
            </h2>
          </div>
        </div>
        <div className="route-rows">
          <div className="row">
            <Checkbox
              checked={hiddenRouteChecked(null)}
              onChange={checkHiddenRoute}
              name={'all'}
              width={30}
              height={30}
            />
            <span className="all"> {props.t('all')}</span>
          </div>
          {(showInputs || renamedDestinations.length > 0) && (
            <div className={cx('row', 'small')}>
              <div className="empty-space"></div>
              <div className={cx('lang', 'fi')}>FI</div>
              <div className={cx('lang', 'sv')}>SV</div>
              <div className={cx('lang', 'en')}>EN</div>
            </div>
          )}
          {props.combinedPatterns.map((pattern, index) => {
            const renamedDestination = renamedDestinations?.find(
              d => d.pattern === pattern,
            );

            const keyForInput = 3 * index + 1;

            const patternArray = pattern.split(':');
            return (
              <div key={`r-${index}`} className="row">
                <Checkbox
                  key={`c-${index}`}
                  checked={hiddenRouteChecked(pattern)}
                  onChange={checkHiddenRoute}
                  name={pattern}
                  width={30}
                  height={30}
                />
                <div className="vehicle">
                  <Icon img={vehicleMode} />
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
              </div>
            );
          })}
        </div>
        <div className="divider-routes" />
        <div
          className={cx(
            'button-container',
            props.combinedPatterns.length < 5 ? 'less' : '',
          )}
        >
          <Button onClick={handleClose} text={props.t('save')} />
        </div>
      </div>
    </Modal>
  );
};
export default withTranslation('translations')(StopRoutesModal);
