import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import monitorAPI from '../api';
import { MonitorContext } from '../contexts';
import Icon from './Icon';
import MonitorOverlay from './MonitorOverlay';
import MonitorTitlebar from './MonitorTitleBar';
import cx from 'classnames';

interface IProps {
  setQueryError?: any;
  preview?: boolean;
}

const QueryError: FC<IProps> = ({ setQueryError, preview }) => {
  const [t] = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentLang, setCurrentLang] = useState(0);
  const monitor = useContext(MonitorContext);
  const view = monitor?.cards[0];
  const languages = monitor?.languages;

  useEffect(() => {
    const controller = new AbortController();
    const id = setInterval(() => {
      monitorAPI.getPing(controller.signal).then((res: any) => {
        if (res.status === 200) {
          setQueryError(false);
        }
        return;
      });
    }, 15000);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, []);
  useEffect(() => {
    const nextLan = (currentLang + 1) % languages.length;
    const to = setTimeout(() => {
      setCurrentLang(nextLan);
    }, view.duration * 1000);
    return () => clearTimeout(to);
  }, [currentLang]);
  let to;
  return (
    <div
      className={cx('main-content-container', {
        preview: preview,
        portrait: view.layout > 11,
      })}
      onMouseMove={() => {
        setShowOverlay(true);
        clearTimeout(to);
        to = setTimeout(() => setShowOverlay(false), 3000);
      }}
    >
      {view && (
        <MonitorTitlebar
          isLandscape
          preview={preview}
          view={view}
          currentLang={languages[currentLang]}
        />
      )}
      <div className="query-error">
        {!preview && (
          <MonitorOverlay
            show={showOverlay}
            createNew
            buttonTranslationKey={'quickDisplayCreate'}
          />
        )}
        <Icon
          img={'query-error-alert'}
          width={120}
          height={120}
          color={'white'}
        />
        <span>{t('query-error', { lng: languages[currentLang] })}</span>
      </div>
    </div>
  );
};
export default QueryError;
