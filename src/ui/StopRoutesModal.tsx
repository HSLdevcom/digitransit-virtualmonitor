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
Modal.setAppElement('#root');

interface IRoute {
  gtfsID?: string;
  shortName?: string;
  code?: string;
}
interface IPattern {
  code: string;
  headsign: string;
  route: IRoute;
}

interface Props {
  showModal: boolean;
  routes: IPattern[];
  stop: IStopInfo;
  closeModal: (route: IRoute[]) => void;
  hiddenRoutes?: any;
}

const StopRoutesModal: FC<Props & WithTranslation> = (
  props: Props & WithTranslation,
) => {
  const defaultSettings = {
    hiddenRoutes: [],
    showStopNumber: false,
    showEndOfLine: false,
    timeShift: 0,
  };
  const [settings, setSettings] = useState(
    props.hiddenRoutes || defaultSettings,
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
    }
    setSettings(newSettings);
  };
  const checkHiddenRoute = option => {
    if (option === 'all') {
      const routes =
        settings.hiddenRoutes.length === props.routes.length
          ? []
          : props.routes;
      setSettings({ ...settings, hiddenRoutes: routes.map(r => r.code) });
    } else if (option) {
      if (settings.hiddenRoutes.includes(option)) {
        setSettings({
          ...settings,
          hiddenRoutes: settings.hiddenRoutes.filter(r => r !== option),
        });
      } else {
        setSettings({
          ...settings,
          hiddenRoutes: [...settings.hiddenRoutes, option],
        });
      }
    }
    if (settings.hiddenRoutes.length !== props.routes.length) {
      const input = document?.getElementById('all') as HTMLInputElement;
      if (input) {
        input.checked = false;
      }
    }
  };

  const handleClose = () => {
    props.closeModal?.(settings);
  };
  const hiddenRouteChecked = route => {
    if (!route) {
      return settings.hiddenRoutes.length === props.routes.length;
    }
    return settings.hiddenRoutes.includes(route.code);
  };

  const handleTimeShift = option => {
    setSettings({ ...settings, timeShift: option.value });
  };

  const durations = [
    { value: '0', label: '0 min' },
    { value: '1', label: '1 min' },
    { value: '2', label: '2 min' },
    { value: '3', label: '3 min' },
    { value: '4', label: '4 min' },
    { value: '5', label: '5 min' },
    { value: '6', label: '6 min' },
    { value: '7', label: '7 min' },
    { value: '8', label: '8 min' },
    { value: '9', label: '9 min' },
    { value: '10', label: '10 min' },
  ];
  const vehicleMode = props.stop.vehicleMode
    ? props.stop.vehicleMode.toLowerCase()
    : 'bus';
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
            <span className="setting-text">Pysäkkinumero</span>
            </div>
            <div className="setting">
            <Checkbox
              checked={settings.showEndOfLine}
              onChange={checkShowSetting}
              name={'showEndOfLine'}
              width={30}
              height={30}
            />{' '}
            <span className={'setting-text'}> {props.t('endOfLine')} </span>
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
        <h2>
          {props.t('hideLines')}
          {settings.hiddenRoutes.length
            .toString()
            .concat(' / ')
            .concat(props.routes.length)}
        </h2>{' '}
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
          {props.routes.map(pattern => {
            const route = pattern.route;
            return (
              <div key={uuid()} className="row">
                {' '}
                <Checkbox
                  checked={hiddenRouteChecked(pattern)}
                  onChange={checkHiddenRoute}
                  name={pattern.code}
                  width={30}
                  height={30}
                />
                <div className="bus">
                  <Icon img={vehicleMode} />
                </div>{' '}
                <div className="route-number"> {route.shortName}</div>{' '}
                <div className="destination">{pattern.headsign}</div>
              </div>
            );
          })}
        </div>
        <div className="divider-routes" />
        <div
          className={cx(
            'button-container',
            props.routes.length < 5 ? 'less' : '',
          )}
        >
          <Button onClick={handleClose} text={props.t('save')} />
        </div>
      </div>
    </Modal>
  );
};
export default withTranslation('translations')(StopRoutesModal);
