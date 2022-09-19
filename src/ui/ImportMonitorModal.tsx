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
  const [addingMonitor, setAddingMonitor] = useState(false);
  const [importFailed, setImportFailed] = useState(false);

  const importStaticMonitor = url => {
    monitorAPI
      .getStatic(url)
      .then((r: any) => {
        if (r.contenthash) {
          setMonitor({
            ...r,
            name:
              r.name !== ''
                ? `${t('stop-display')} ${monitorCount + 1}`
                : r.name,
          });
        } else {
          setImportFailed(true);
        }
      })
      .catch(() => setImportFailed(true));
  };

  const importHashMonitor = (hash: string) => {
    const contenthash = hash.replace(' ', '+');
    monitorAPI
      .get(contenthash)
      .then((r: any) => {
        if (r?.contenthash) {
          setMonitor({
            ...r,
            name: `${t('stop-display')} ${monitorCount + 1}`,
          });
        } else {
          setImportFailed(true);
        }
      })
      .catch(() => setImportFailed(true));
  };

  const importMonitor = () => {
    setImportFailed(false);
    const search = url.indexOf('?') !== -1 ? url.split('?')[1] : url;
    const searchParams = new URLSearchParams(search);
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
        setImportFailed(true);
      }
    }
  };

  const addMonitor = () => {
    const newUuid = uuidv5(
      DateTime.now().toSeconds() + monitor.contenthash,
      namespace,
    );
    const newStaticMonitor = {
      ...monitor,
      url: newUuid,
    };
    setAddingMonitor(true);
    monitorAPI.createStatic(newStaticMonitor).then((res: any) => {
      if (res.status === 200 || res.status === 409) {
        refetchMonitors();
        onRequestClose();
        setAddingMonitor(false);
      }
    });
  };

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
        {importFailed && (
          <div className="no-monitor-found">{t('no-monitor-found')}</div>
        )}

        {monitor?.id && (
          <div className="import-preview">
            <UserMonitorCard view={monitor} onDelete={undefined} preview />
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
