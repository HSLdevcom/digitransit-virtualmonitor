import React, { FC } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Icon from './Icon';
import cx from 'classnames';
import Checkbox from './CheckBox';
import { v4 as uuid } from 'uuid';

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
      <section
        className="display-orientation-container"
        aria-label={t('displayDirection')}
      >
        <div className="orientation-header">{t('displayDirection')}</div>
        <div className="orientation-controls">
          <button
            className={cx('orientation-button', {
              selected: orientation === 'horizontal',
            })}
            onClick={() => handleOrientation('horizontal')}
            aria-label={t('displayDirection') + ' ' + t('horizontal')}
            role="button"
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
        <div className="language-header">{t('displayLanguages')}</div>
        {languages.length < 1 && (
          <div className="language-alert" role="alert">
            {t('chooseOne')}
          </div>
        )}
        <div className="language-controls">
          {options.map(option => {
            return (
              <React.Fragment key={uuid()}>
                <Checkbox
                  name={option}
                  checked={isChecked(option)}
                  onChange={handleChange}
                  ariaLabel={
                    t('displayLanguage') +
                    ' ' +
                    t(
                      `languageName${
                        option.charAt(0).toUpperCase() + option.slice(1)
                      }`,
                    )
                  }
                />
                <div>{option.toUpperCase()}</div>
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default withTranslation('translations')(DisplaySettings);
