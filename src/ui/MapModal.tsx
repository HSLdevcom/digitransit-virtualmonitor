import React, { FC } from 'react';
import Modal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import MonitorMapContainer from '../MonitorMapContainer';
import { useMergeState } from '../util/utilityHooks';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');
interface Props {
  isOpen: boolean;
  onClose: (boolean) => void;
  isLandscape: boolean;
  mapSettings?: any;
  updateMapSettings: any;
}
const MapModal: FC<Props> = ({
  isOpen,
  onClose,
  isLandscape,
  mapSettings,
  updateMapSettings,
}) => {
  const [t] = useTranslation();
  const [state, setState] = useMergeState({
    zoom: undefined,
    center: undefined,
  });
  const handleClick = () => {
    updateMapSettings({
      ...mapSettings,
      zoom: state.zoom,
      center: state.center,
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
        <MonitorMapContainer
          mapSettings={mapSettings}
          updateMap={setState}
          modal
        ></MonitorMapContainer>
        <button className="btn" onClick={() => handleClick()}>
          {t('confirm-choice')}
        </button>
      </div>
    </Modal>
  );
};
export default MapModal;
