import React, { FC } from 'react';
import Modal from 'react-modal';
import { IMonitor } from '../util/Interfaces';
import CarouselDataContainer from './CarouselDataContainer';
import Icon from './Icon';
import cx from 'classnames';
import InformationDisplayContainer from './InformationDisplayContainer';
import { getStationIds, isPlatformOrTrackVisible } from '../util/monitorUtils';
import TrainDataFetcher from './TrainDataFetcher';

Modal.setAppElement('#root');
interface Props {
  view: IMonitor;
  languages: Array<string>;
  isOpen: boolean;
  onClose: (boolean) => void;
  isLandscape: boolean;
}
const PreviewModal: FC<Props> = (props: Props) => {
  const stationIds = getStationIds(props.view);
  const showPlatformsOrTracks = stationIds.length
    ? isPlatformOrTrackVisible(props.view)
    : false;

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={() => props.onClose(false)}
        portalClassName={cx('preview', !props.isLandscape ? 'portrait' : '')}
      >
        <div className="title-and-close">
          <div className="title">Esikatselu</div>
          <div
            role="button"
            className="close"
            onClick={() => props.onClose(false)}
          >
            <Icon img={'close'} height={15} width={15} color={'#FFFFFF'} />
          </div>
        </div>
        <div className="carouselContainer">
          {props.view.isInformationDisplay ? (
            <InformationDisplayContainer preview monitor={props.view} />
          ) : (
            <>
              {stationIds.length && showPlatformsOrTracks ? (
                <TrainDataFetcher
                  monitor={props.view}
                  stationIds={stationIds}
                  preview
                />
              ) : (
                <CarouselDataContainer
                  languages={props.languages}
                  views={props.view.cards}
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

export default PreviewModal;
