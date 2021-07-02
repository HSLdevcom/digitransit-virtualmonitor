import React, { FC } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import './DisplaySettings.scss';
import Icon from './Icon';
import cx from 'classnames';
import Checkbox from './CheckBox';

interface IProps {
  languages: Array<string>;
  orientation: string;
  handleChange: (language: string) => void;
  handleOrientation: (orientation: string) => void;
}

const DisplaySettings: FC<IProps & WithTranslation> = ({
  languages,
  orientation,
  handleOrientation,
  handleChange,
  t,
}) => {
  const options = ['fi', 'sv', 'en'];
  const isChecked = (option: string) => {
    return languages.includes(option);
  };
  return (
    <div className="display-settings-container">
      <div className="display-orientation-container">
        <div className="orientation-header">{t('displayDirection')}</div>
        <div className="orientation-controls">
          <button
            className={cx('orientation-button', {
              selected: orientation === 'horizontal',
            })}
            onClick={() => handleOrientation('horizontal')}
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
            <div> {t('horizontal')}</div>
          </button>
          <button
            className={cx('orientation-button', {
              selected: orientation === 'vertical',
            })}
            onClick={() => handleOrientation('vertical')}
          >
            <Icon
              img={
                orientation === 'vertical' ? 'rectangle-selected' : 'rectangle'
              }
              rotate={'90'}
              height={32}
              width={32}
            />
            <div>{t('vertical')}</div>
          </button>
        </div>
      </div>
      <div className="display-language-container">
        <div className="language-header">{t('displayLanguage')}</div>
        {languages.length < 1 && (
          <div className="language-alert">{t('chooseOne')}</div>
        )}
        <div className="language-controls">
          {options.map(option => {
            return (
              <>
                <Checkbox
                  name={option}
                  checked={isChecked(option)}
                  onChange={handleChange}
                />
                <div>{t(option)}</div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default withTranslation('translations')(DisplaySettings);
