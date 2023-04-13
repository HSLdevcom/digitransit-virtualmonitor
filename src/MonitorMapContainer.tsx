import React, { FC, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import MonitorMap from './ui/monitorMap';
import { IMapSettings } from './util/Interfaces';
import { changeTopics, startMqtt, stopMqtt } from './util/mqttUtils';
import { useMergeState } from './util/utilityHooks';
interface IProps {
  preview?: boolean;
  mapSettings: IMapSettings;
  modal?: boolean;
  updateMap?: (settings: IMapSettings) => void;
  topics?: string[];
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
  const [started, setStarted] = useState(false);
  const clientRef = useRef(null);
  const topicRef = useRef(null);

  if (state.client) {
    clientRef.current = state.client;
    if (!started) {
      setStarted(true);
    } else if (topicRef.current.length === 0) {
      // We have new topics and current topics are empty, so client needs to be updated
      const settings = {
        client: clientRef.current,
        oldTopics: [],
        options: topics,
      };
      changeTopics(settings, setState, topicRef);
    }
  }
  useEffect(() => {
    if ((topics && topics.length) || (!state.client && !started && topics)) {
      startMqtt(topics, setState, clientRef, topicRef);
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
        currentState={state}
        newTopics={topics}
        setState={setState}
        topicRef={topicRef}
      />
    </div>
  );
};
export default MonitorMapContainer;
