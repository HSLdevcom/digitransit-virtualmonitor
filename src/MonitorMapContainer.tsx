import React, { FC } from 'react';
import cx from 'classnames';
import MonitorMap from './ui/monitorMap';
import { IMapSettings } from './util/Interfaces';
interface IProps {
  preview?: boolean;
  mapSettings: IMapSettings;
  modal?: boolean;
  updateMap?: (settings: IMapSettings) => void;
  departuresForMap?: any;
  lang: string;
  mqttProps?: any;
}
const MonitorMapContainer: FC<IProps> = ({
  preview,
  mapSettings,
  modal,
  updateMap,
  departuresForMap,
  lang,
  mqttProps,
}) => {
  const isLandscape = true;
  const {
    messages,
    clientRef,
    newTopics,
    topicRef,
    vehicleMarkerState,
    setVehicleMarkerState,
  } = mqttProps || { messages: [] };
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
        newTopics={newTopics}
        topicRef={topicRef}
        departuresForMap={departuresForMap}
        lang={lang}
        vehicleMarkerState={vehicleMarkerState}
        setVehicleMarkerState={setVehicleMarkerState}
      />
    </div>
  );
};
export default MonitorMapContainer;
