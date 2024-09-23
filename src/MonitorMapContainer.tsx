import React, { FC, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import MonitorMap from './ui/monitorMap';
import { IMapSettings } from './util/Interfaces';
interface IProps {
  preview?: boolean;
  mapSettings: IMapSettings;
  modal?: boolean;
  updateMap?: (settings: IMapSettings) => void;
  topics?: string[];
  departures?: any;
  lang: string;
  messages?: any;
  clientRef?: any;
  topicRef?: any;
  vehicleMarkerState?: any;
  setVehicleMarkerState?: any;
}
const MonitorMapContainer: FC<IProps> = ({
  preview,
  mapSettings,
  modal,
  updateMap,
  topics,
  departures,
  lang,
  messages = [],
  clientRef,
  topicRef,
  vehicleMarkerState,
  setVehicleMarkerState,
}) => {
  const isLandscape = true;

  return (
    <div
      className={cx('monitor-container', {
        preview: preview,
        portrait: !isLandscape,
        'two-cols': false,
        tightened: false,
      })}
    >
      <MonitorMap
        preview={preview}
        mapSettings={mapSettings}
        modal={modal}
        updateMap={updateMap}
        messages={messages}
        clientRef={clientRef}
        newTopics={topics}
        topicRef={topicRef}
        departures={departures}
        lang={lang}
        vehicleMarkerState={vehicleMarkerState}
        setVehicleMarkerState={setVehicleMarkerState}
      />
    </div>
  );
};
export default MonitorMapContainer;
