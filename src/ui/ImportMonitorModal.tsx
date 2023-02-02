import React, { FC, useState } from 'react';
import LargeModal from './LargeModal';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { isKeyboardSelectionEvent } from '../util/browser';
import cx from 'classnames';
import monitorAPI from '../api';
import UserMonitorCard from './UserMonitorCard';
import { v5 as uuidv5, validate } from 'uuid';
import { namespace } from '../util/monitorUtils';
import Loading from './Loading';
import { getConfig, getDomainIdentifierForTheme } from '../util/getConfig';
import { IMonitor } from '../util/Interfaces';
import { useMergeState } from '../util/utilityHooks';

interface IProps {
  onRequestClose: () => void;
  refetchMonitors: () => void;
  monitorCount: number;
}
const ImportMonitorModal: FC<IProps> = ({
  refetchMonitors,
  onRequestClose,
  monitorCount,
}) => {
  const [t] = useTranslation();
  const [url, setUrl] = useState('');
  const [monitor, setMonitor] = useState(null);

  const [importState, setImportState] = useMergeState({
    addingMonitor: false,
    viewNotFound: false,
    incorrectInstance: false,
    saveFailed: false,
    importQueryError: false,
  });

  const setTitle = (title: string) => {
    setMonitor({
      ...monitor,
      name: title,
    });
  };

  const importStaticMonitor = url => {
    monitorAPI
      .getStatic(url)
      .then((r: IMonitor) => {
        if (r.contenthash) {
          if (!r.instance || r.instance === getConfig().name) {
            setMonitor({
              ...r,
              name:
                r.name === ''
                  ? `${t('stop-display')} ${monitorCount + 1}`
                  : r.name,
            });
          } else {
            setImportState({ incorrectInstance: true });
          }
        } else {
          setImportState({ viewNotFound: true });
        }
      })
      .catch(e => {
        setImportState({ importQueryError: true });
      });
  };

  const importHashMonitor = (hash: string) => {
    const contenthash = hash.replaceAll(' ', '+');
    monitorAPI
      .get(contenthash)
      .then((r: IMonitor) => {
        if (r?.contenthash) {
          if (!r.instance || r.instance === getConfig().name) {
            setMonitor({
              ...r,
              name: `${t('stop-display')} ${monitorCount + 1}`,
            });
          } else {
            setImportState({ incorrectInstance: true });
          }
        } else {
          setImportState({ viewNotFound: true });
        }
      })
      .catch(() => setImportState({ viewNotFound: true }));
  };

  const urlBelongsToInstance = () => {
    const currentTheme = getConfig().name;
    const themeMatchingGivenUrl = Object.keys(getDomainIdentifierForTheme).find(
      theme => url.indexOf(getDomainIdentifierForTheme[theme]) >= 0,
    );
    if (themeMatchingGivenUrl && themeMatchingGivenUrl !== currentTheme) {
      setImportState({ incorrectInstance: true });
      return false;
    }
    return true;
  };

  const importMonitor = () => {
    setImportState({
      viewNotFound: false,
      incorrectInstance: false,
      importQueryError: false,
    });

    const search = url.indexOf('?') !== -1 ? url.split('?')[1] : url;
    const searchParams = new URLSearchParams(search);

    if (urlBelongsToInstance()) {
      if (searchParams.has('url')) {
        importStaticMonitor(searchParams.get('url'));
      } else if (searchParams.has('cont')) {
        importHashMonitor(searchParams.get('cont'));
      } else {
        if (validate(url)) {
          importStaticMonitor(url);
        } else if (url.length === 24) {
          importHashMonitor(url);
        } else {
          setImportState({ viewNotFound: true });
        }
      }
    }
  };

  const addMonitor = () => {
    setImportState({ addingMonitor: true, saveFailed: false });
    const newUuid = uuidv5(
      DateTime.now().toSeconds() + monitor.contenthash,
      namespace,
    );
    const newStaticMonitor = {
      ...monitor,
      url: newUuid,
      instance: getConfig().name,
    };
    monitorAPI.createStatic(newStaticMonitor).then((res: any) => {
      if (res.status === 200 || res.status === 409) {
        refetchMonitors();
        onRequestClose();
        setImportState({ addingMonitor: false });
      } else {
        setImportState({ addingMonitor: false, saveFailed: true });
      }
    });
  };

  const {
    addingMonitor,
    viewNotFound,
    incorrectInstance,
    saveFailed,
    importQueryError,
  } = importState;

  return (
    <LargeModal
      header={'import-monitor'}
      portalClassName={'import-modal modal'}
      onRequestClose={onRequestClose}
    >
      <div className="instructions">{t('import-instructions')}</div>
      <div className="import-modal-content">
        <div className="input-row">
          <input
            id={'input-import-monitor'}
            onKeyDown={e => {
              if (isKeyboardSelectionEvent(e)) {
                importMonitor();
              }
            }}
            placeholder={'url'}
            onChange={e => setUrl(e.target.value)}
            value={url}
          />
          <button onClick={importMonitor} className="monitor-button white">
            {t('import')}
          </button>
        </div>
        {(incorrectInstance && (
          <div className="no-monitor-found" role="alert">
            {t('incorrect-instance')}
          </div>
        )) ||
          (importQueryError && (
            <div className="no-monitor-found" role="alert">
              {t('query-error')}
            </div>
          )) ||
          (viewNotFound && (
            <div className="no-monitor-found" role="alert">
              {t('no-monitor-found')}
            </div>
          ))}

        {monitor?.id && (
          <div className="import-preview">
            <UserMonitorCard
              view={monitor}
              onDelete={undefined}
              preview
              setTitle={setTitle}
            />
          </div>
        )}
        {saveFailed && (
          <div className="no-monitor-found" role="alert">
            {t('save-failed')}
          </div>
        )}
        <div className="import-button-container">
          <button
            onClick={addMonitor}
            disabled={!monitor || addingMonitor}
            className={cx('monitor-button blue', { loading: addingMonitor })}
          >
            {addingMonitor && (
              <div className="loading-button">
                <Loading small primary />
              </div>
            )}
            {t('add-to-own-displays')}
          </button>
        </div>
      </div>
    </LargeModal>
  );
};

export default ImportMonitorModal;
