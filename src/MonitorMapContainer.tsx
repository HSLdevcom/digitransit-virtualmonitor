import React, { FC, useContext, useEffect, useRef } from 'react';
import cx from 'classnames';
import MonitorMap from './ui/monitorMap';
import { IMapSettings } from './util/Interfaces';
import { startMqtt, stopMqtt } from './util/mqttUtils';
import { useMergeState } from './util/utilityHooks';
type Option = {
  feedId: string; // tampere
  route: string; // 36
  shortName: string; // 26
  type: number | 3; // 3
};
interface IProps {
  preview?: boolean;
  mapSettings: IMapSettings;
  modal?: boolean;
  updateMap?: any;
  topics?: Array<Option>;
}
const MonitorMapContainer: FC<IProps> = ({
  preview,
  mapSettings,
  modal,
  updateMap,
  topics,
}) => {
  const [state, setState] = useMergeState({
    client: undefined,
    topics: [],
    messages: [],
  });
  const clientRef = useRef(null);
  const topicRef = useRef(null);

  if (state.client) {
    clientRef.current = state.client;
    topicRef.current = state.topics;
  }
  useEffect(() => {
    if (topics) {
      startMqtt(topics, setState, clientRef);
    }
    return () => {
      stopMqtt(clientRef.current, topicRef.current, setState);
    };
  }, []);
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
        messages={state.messages}
        client={state.client}
        currentState={state}
        newTopics={topics}
        setState={setState}
      />
    </div>
  );
};
export default MonitorMapContainer;
