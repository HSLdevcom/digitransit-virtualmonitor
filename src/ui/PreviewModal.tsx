import React, { FC } from 'react';
import Modal from 'react-modal';
import { IMonitor, ICard } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Icon from './Icon';
import cx from 'classnames';
import InformationDisplayContainer from './InformationDisplayContainer';
import { useTranslation } from 'react-i18next';
import TrainDataPreparer from './TrainDataPreparer';

Modal.setAppElement('#root');
interface Props {
  view: IMonitor;
  languages: Array<string>;
  isOpen: boolean;
  onClose: (boolean) => void;
  isLandscape: boolean;
  stations: Array<ICard>;
  stops: Array<ICard>;
  showPlatformsOrTracks: boolean;
}
const PreviewModal: FC<Props> = ({
  view,
  languages,
  isOpen,
  onClose,
  isLandscape,
  stations,
  stops,
  showPlatformsOrTracks,
}) => {
  const [t] = useTranslation();
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => onClose(false)}
        portalClassName={cx('preview', !isLandscape ? 'portrait' : '')}
      >
        <div className="title-and-close">
          <div className="title">{t('preview')}</div>
          <section id="close">
            <button
              className="close"
              role="button"
              aria-label={t('close')}
              onClick={() => onClose(false)}
            >
              <Icon img="close" color={'#FFFFFF'} height={16} width={16} />
            </button>
          </section>
        </div>
        <section id={isLandscape ? 'previewMonitor' : 'previewMonitorPortrait'}>
          <div className="carouselContainer">
            {view.isInformationDisplay ? (
              <InformationDisplayContainer preview monitor={view} />
            ) : (
              <>
                {(stations.length || stops.length) && showPlatformsOrTracks ? (
                  <TrainDataPreparer
                    monitor={view}
                    stations={stations}
                    stops={stops}
                    preview
                  />
                ) : (
                  <CarouselDataContainer
                    languages={languages}
                    views={view.cards}
                    preview
                    initTime={new Date().getTime()}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </Modal>
    </>
  );
};

export default PreviewModal;
