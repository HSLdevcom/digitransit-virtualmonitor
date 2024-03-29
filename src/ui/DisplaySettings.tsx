import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import cx from 'classnames';
import Checkbox from './CheckBox';
import { ConfigContext } from '../contexts';
import Toggle from './Toggle';

interface IProps {
  languages: Array<string>;
  orientation: string;
  handleChange: (language: string) => void;
  handleOrientation: (orientation: string) => void;
  showMap: boolean;
  setShowMap: (boolean) => void;
  disableToggle?: boolean;
}

const DisplaySettings: FC<IProps> = ({
  languages,
  orientation,
  handleOrientation,
  handleChange,
  showMap,
  setShowMap,
  disableToggle,
}) => {
  const config = useContext(ConfigContext);
  const [t] = useTranslation();
  const options = ['fi', 'sv', 'en'];
  const isChecked = (option: string) => {
    return languages.includes(option);
  };
  const lang = localStorage.getItem('lang') || 'fi';
  return (
    <div className="display-settings-container">
      <section
        className="display-orientation-container"
        aria-label={t('displayDirection')}
      >
        <div className="headers">
          <div className="orientation-header">{t('displayDirection')}</div>
        </div>
        <div className="orientation-controls">
          <button
            className={cx('orientation-button', {
              selected: orientation === 'horizontal',
            })}
            onClick={() => handleOrientation('horizontal')}
            aria-label={t('displayDirection') + ' ' + t('horizontal')}
            role="button"
            disabled={orientation === 'horizontal'}
          >
            <Icon
              img={
                orientation === 'horizontal'
                  ? 'rectangle-selected'
                  : 'rectangle'
              }
              height={32}
              width={32}
            />
          </button>
          <button
            className={cx('orientation-button', {
              selected: orientation === 'vertical',
            })}
            onClick={() => handleOrientation('vertical')}
            aria-label={t('displayDirection') + ' ' + t('vertical')}
            role="button"
            disabled={orientation === 'vertical'}
          >
            <Icon
              img={
                orientation === 'vertical' ? 'rectangle-selected' : 'rectangle'
              }
              rotate={'90'}
              height={32}
              width={32}
            />
          </button>
        </div>
      </section>
      <section
        className="display-language-container"
        aria-label={t('displayLanguages')}
      >
        <div className="headers">
          <div
            className={cx('language-header ' + lang, {
              hsl: config.name === 'hsl',
            })}
          >
            {t('displayLanguages')}
          </div>
        </div>
        {languages.length === 0 && (
          <div className="language-alert" aria-hidden="true">
            {t('chooseOne')}
          </div>
        )}
        <div className="language-controls">
          {options.map(option => {
            return (
              <Checkbox
                key={`check_${option}`}
                name={option}
                isSelected={isChecked(option)}
                onChange={() => handleChange(option)}
                aria-label={
                  t('displayLanguage') + ' ' + t(`language-name-${option}`)
                }
                color={config.colors.primary}
              >
                {option.toUpperCase()}
              </Checkbox>
            );
          })}
        </div>
      </section>
      {config.map.inUse && (
        <section className="display-language-container">
          <div className="headers">
            <div
              className={cx('map-header ' + lang, {
                hsl: config.name === 'hsl',
              })}
            >
              {t('displayMap')}
            </div>
          </div>
          {config.map.inUse && (
            <div className="map-toggle">
              {' '}
              <label>
                <Toggle
                  id="toggle"
                  toggled={showMap}
                  title="showmap"
                  onToggle={setShowMap}
                  disabled={disableToggle}
                />
              </label>
              <div className="txt">{t('showMap')}</div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DisplaySettings;
