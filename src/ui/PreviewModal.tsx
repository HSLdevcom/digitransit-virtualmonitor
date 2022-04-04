import React, { FC } from 'react';
import Modal from 'react-modal';
import { IMonitor, ICard } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Icon from './Icon';
import cx from 'classnames';
import InformationDisplayContainer from './InformationDisplayContainer';
import TrainDataFetcher from './TrainDataFetcher';
import { withTranslation, WithTranslation } from 'react-i18next';
import TrainDataPreparer from './TrainDataPreparer';

Modal.setAppElement('#root');
interface Props {
  view: IMonitor;
  languages: Array<string>;
  isOpen: boolean;
  onClose: (boolean) => void;
  isLandscape: boolean;
  instance?: string;
  stations: Array<ICard>;
  stops: Array<ICard>;
  showPlatformsOrTracks: boolean;
}
const PreviewModal: FC<Props & WithTranslation> = ({
  view,
  languages,
  isOpen,
  onClose,
  isLandscape,
  instance,
  stations,
  stops,
  showPlatformsOrTracks,
  t,
}) => {
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

export default withTranslation('translations')(PreviewModal);
