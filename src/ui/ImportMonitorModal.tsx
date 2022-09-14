import React, { FC, useContext, useEffect, useState } from 'react';
import LargeModal from './LargeModal';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Icon from './Icon';
import { ConfigContext } from '../contexts';
import { isKeyboardSelectionEvent } from '../util/browser';
import { getParams } from '../util/queryUtils';
import monitorAPI from '../api';
import UserMonitorCard from './UserMonitorCard';
import { createProxyMiddleware } from 'http-proxy-middleware';

interface IProps {
  handleOpenState: any;
}
const ImportMonitorModal: FC<IProps> = ({ handleOpenState }) => {
  const [t] = useTranslation();
  const config = useContext(ConfigContext);
  const [url, setUrl] = useState('');
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(false);

  const importMonitor = () => {
    const { url: staticUrl, cont: hash } = getParams(url);
    if (hash) {
      monitorAPI
        .get(hash)
        .then(r => {
          setMonitor(r);
        })
        .catch(() => setLoading(false));
    } else if (staticUrl) {
      monitorAPI
        .getStatic(staticUrl)
        .then(r => {
          setMonitor(r);
        })
        .catch(() => setLoading(false));
    }
  };
  return (
    <LargeModal
      header={'import-monitor'}
      handleOpenState={() => handleOpenState(false)}
    >
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

        {monitor?.id && (
          <div className="import-preview">
            <UserMonitorCard view={monitor} onDelete={undefined} preview />
          </div>
        )}
        <div className="import-button-container">
          <button disabled={!monitor} className="monitor-button blue">
            {t('add-to-own-displays')}
          </button>
        </div>
      </div>
    </LargeModal>
  );
};

export default ImportMonitorModal;
