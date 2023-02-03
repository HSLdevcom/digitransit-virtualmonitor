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
  const view = monitor?.cards?.[0];
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
    const nextLan = (currentLang + 1) % languages?.length;
    const duration = view?.duration ? view.duration * 1000 : 5000;
    const to = setTimeout(() => {
      setCurrentLang(nextLan);
    }, duration);
    return () => clearTimeout(to);
  }, [currentLang]);
  let to;
  const isPortrait = view?.layout > 11;
  const lang = languages
    ? languages[currentLang]
    : window.localStorage.getItem('lang') || 'fi';
  return (
    <div
      className={cx('main-content-container', {
        preview: preview,
        portrait: isPortrait,
      })}
      onMouseMove={() => {
        setShowOverlay(true);
        clearTimeout(to);
        to = setTimeout(() => setShowOverlay(false), 3000);
      }}
    >
      {view && (
        <MonitorTitlebar
          isLandscape={!isPortrait}
          preview={preview}
          view={view}
          currentLang={lang}
        />
      )}
      <div className={cx('query-error', { preview: preview })}>
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
        <span>{t('query-error', { lng: lang })}</span>
      </div>
    </div>
  );
};
export default QueryError;
