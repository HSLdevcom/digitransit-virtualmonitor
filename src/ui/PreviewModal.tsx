import React, { FC } from 'react';
import Modal from 'react-modal';
import { IMonitor } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Icon from './Icon';
import cx from 'classnames';
import InformationDisplayContainer from './InformationDisplayContainer';
import { getStationIds, isPlatformOrTrackVisible } from '../util/monitorUtils';
import TrainDataFetcher from './TrainDataFetcher';
import { withTranslation, WithTranslation } from 'react-i18next';
import { getColorByName } from '../util/getConfig';

Modal.setAppElement('#root');
interface Props {
  view: IMonitor;
  languages: Array<string>;
  isOpen: boolean;
  onClose: (boolean) => void;
  isLandscape: boolean;
}
const PreviewModal: FC<Props & WithTranslation> = ({
  view,
  languages,
  isOpen,
  onClose,
  isLandscape,
  t
}) => {
  const stationIds = getStationIds(view);
  const showPlatformsOrTracks = stationIds.length
    ? isPlatformOrTrackVisible(view)
    : false;

  const style =  {
    background: getColorByName('monitorBackground') || getColorByName('primary')
  } as React.CSSProperties;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => onClose(false)}
        portalClassName={cx('preview', !isLandscape ? 'portrait' : '')}
      >
        <div className="title-and-close">
          <div className="title">{t('preview')}</div>
          <div
            role="button"
            className="close"
            onClick={() => onClose(false)}
          >
            <Icon img={'close'} height={15} width={15} color={'#FFFFFF'} />
          </div>
        </div>
        <div className="carouselContainer" style={style}>
          {view.isInformationDisplay ? (
            <InformationDisplayContainer preview monitor={view} />
          ) : (
            <>
              {stationIds.length && showPlatformsOrTracks ? (
                <TrainDataFetcher
                  monitor={view}
                  stationIds={stationIds}
                  preview
                />
              ) : (
                <CarouselDataContainer
                  languages={languages}
                  views={view.cards}
                  preview
                />
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default withTranslation('translations')(PreviewModal);
