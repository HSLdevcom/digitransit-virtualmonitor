import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import cx from 'classnames';
import Checkbox from './CheckBox';
import { v4 as uuid } from 'uuid';
import { getPrimaryColor } from '../util/getConfig';

interface IProps {
  languages: Array<string>;
  orientation: string;
  handleChange: (language: string) => void;
  handleOrientation: (orientation: string) => void;
}

const DisplaySettings: FC<IProps> = ({
  languages,
  orientation,
  handleOrientation,
  handleChange,
}) => {
  const [t] = useTranslation();
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
        <div className="language-header">{t('displayLanguages')}</div>
        {languages.length === 0 && (
          <div className="language-alert" aria-hidden="true">
            {t('chooseOne')}
          </div>
        )}
        <div className="language-controls">
          {options.map((option, idx) => {
            return (
              <React.Fragment key={uuid()}>
                <Checkbox
                  name={option}
                  isSelected={isChecked(option)}
                  onChange={() => handleChange(option)}
                  aria-label={
                    t('displayLanguage') +
                    ' ' +
                    t(
                      `languageName${
                        option.charAt(0).toUpperCase() + option.slice(1)
                      }`,
                    )
                  }
                  color={getPrimaryColor()}
                  margin={idx !== 0 ? '0 5px 0 5px' : '0 5px 0 0'}
                >
                  {option.toUpperCase()}
                </Checkbox>
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DisplaySettings;
