import React, { FC } from 'react';
import Modal from 'react-modal';
import { IMonitor, ICard, IMapSettings } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Icon from './Icon';
import cx from 'classnames';
import InformationDisplayContainer from './InformationDisplayContainer';
import { useTranslation } from 'react-i18next';
import TrainDataPreparer from './TrainDataPreparer';
import { MonitorContext } from '../contexts';
import { isPlatformOrTrackVisible } from '../util/monitorUtils';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');
interface Props {
  view: IMonitor;
  languages: Array<string>;
  isOpen: boolean;
  onClose: (boolean) => void;
  isLandscape: boolean;
  stations: Array<ICard>;
  stops: Array<ICard>;
  mapSettings?: IMapSettings;
}
const PreviewModal: FC<Props> = ({
  view,
  languages,
  isOpen,
  onClose,
  isLandscape,
  stations,
  stops,
  mapSettings,
}) => {
  const [t] = useTranslation();
  const monitor = {
    ...view,
    languages,
    mapSettings,
  };
  const layout = view.cards[0].layout;
  const showInfoDisplay = layout > 17 && layout < 19;
  return (
    <MonitorContext.Provider value={monitor}>
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
        <section
          id={isLandscape ? 'preview-monitor' : 'preview-monitor-portrait'}
        >
          <div className="carouselContainer">
            {showInfoDisplay ? (
              <InformationDisplayContainer preview />
            ) : (
              <>
                {(stations.length || stops.length) &&
                isPlatformOrTrackVisible(view) ? (
                  <TrainDataPreparer
                    stations={stations}
                    stops={stops}
                    preview
                  />
                ) : (
                  <CarouselDataContainer
                    preview
                    initTime={new Date().getTime()}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </Modal>
    </MonitorContext.Provider>
  );
};

export default PreviewModal;
