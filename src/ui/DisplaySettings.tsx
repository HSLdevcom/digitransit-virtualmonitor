import React, { FC, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import cx from 'classnames';
import Checkbox from './CheckBox';
import { ConfigContext } from '../contexts';
import Toggle from './Toggle';
import { SupportedLanguage } from '../i18n';
import uniqueId from 'lodash/uniqueId';

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
  const idPrefixRef = useRef<string | null>(null);
  if (idPrefixRef.current === null) {
    idPrefixRef.current = uniqueId('display-settings-');
  }
  const ids = {
    orientation: `${idPrefixRef.current}-orientation`,
    language: `${idPrefixRef.current}-language`,
    map: `${idPrefixRef.current}-map`,
  };
  const options: Array<SupportedLanguage> = ['fi', 'sv', 'en'];
  const isChecked = (option: string) => {
    return languages.includes(option);
  };
  const lang = localStorage.getItem('lang') || 'fi';
  return (
    <div className="display-settings-container">
      <section
        className="display-orientation-container"
        aria-labelledby={ids.orientation}
      >
        <div className="headers">
          <h3 id={ids.orientation} className="orientation-header">
            {t('displayDirection')}
          </h3>
        </div>
        <div className="orientation-controls">
          <button
            className={cx('orientation-button', {
              selected: orientation === 'horizontal',
            })}
            onClick={() => handleOrientation('horizontal')}
            aria-label={t('displayDirection') + ' ' + t('horizontal')}
            aria-pressed={orientation === 'horizontal'}
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
            aria-pressed={orientation === 'vertical'}
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
        aria-labelledby={ids.language}
      >
        <div className="headers">
          <h3
            id={ids.language}
            className={cx('language-header ' + lang, {
              hsl: config.name === 'hsl',
            })}
          >
            {t('displayLanguages')}
          </h3>
        </div>
        <div className="language-alert" role="alert">
          {languages.length === 0 ? t('chooseOne') : ''}
        </div>
        <div className="language-controls">
          {options.map(option => {
            return (
              <Checkbox
                key={`check_${option}`}
                name={option}
                isSelected={isChecked(option)}
                onChange={() => handleChange(option)}
                aria-label={`${option.toUpperCase()} – ${t(
                  'displayLanguage',
                )} ${t(`language-name-${option}`)}`}
                color={config.colors.primary}
              >
                {option.toUpperCase()}
              </Checkbox>
            );
          })}
        </div>
      </section>
      {config.map.inUse && (
        <section
          className="display-language-container"
          aria-labelledby={ids.map}
        >
          <div className="headers">
            <h3
              id={ids.map}
              className={cx('language-header ' + lang, {
                hsl: config.name === 'hsl',
              })}
            >
              {t('displayMap')}
            </h3>
          </div>
          {config.map.inUse && (
            <div className="map-toggle">
              {' '}
              <label>
                <Toggle
                  toggled={showMap}
                  onToggle={setShowMap}
                  disabled={disableToggle}
                />
                <span className="txt">{t('showMap')}</span>
              </label>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DisplaySettings;
