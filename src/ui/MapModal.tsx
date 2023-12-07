import React, { FC, useContext } from 'react';
import Modal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import MonitorMapContainer from '../MonitorMapContainer';
import { useMergeState } from '../util/utilityHooks';
import Icon from './Icon';
import { ConfigContext } from '../contexts';
import { IMapSettings } from '../util/Interfaces';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');
interface Props {
  isOpen: boolean;
  onClose: (boolean) => void;
  isLandscape: boolean;
  mapSettings?: IMapSettings;
  updateMapSettings: (settings: IMapSettings) => void;
  lang?: string;
}
const MapModal: FC<Props> = ({
  isOpen,
  onClose,
  isLandscape,
  mapSettings,
  updateMapSettings,
  lang,
}) => {
  const [t] = useTranslation();
  const config = useContext(ConfigContext);
  const [state, setState] = useMergeState({
    zoom: undefined,
    center: undefined,
    bounds: undefined,
  });
  const handleClick = () => {
    updateMapSettings({
      ...mapSettings,
      zoom: state.zoom,
      center: state.center,
      bounds: state.bounds,
      userSet: true,
    });
    onClose(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      portalClassName={cx('preview', !isLandscape ? 'portrait' : '')}
    >
      <div className="mapmodal">
        <div className="map-modal-header">
          {' '}
          {t('select-bounds')}{' '}
          <section id="close">
            <button
              className="close-button"
              role="button"
              aria-label={t('close')}
              onClick={() => onClose(false)}
            >
              <Icon
                img="close"
                color={config.colors.primary}
                height={24}
                width={24}
              />
            </button>{' '}
          </section>
        </div>
        <MonitorMapContainer
          mapSettings={mapSettings}
          updateMap={setState}
          modal
          lang={lang}
        ></MonitorMapContainer>
        <button className="btn map-btn" onClick={() => handleClick()}>
          {t('confirm-choice')}
        </button>
      </div>
    </Modal>
  );
};
export default MapModal;
