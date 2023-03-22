import React, { FC, useEffect } from 'react';
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
  routes?: Array<Option>;
}
const MonitorMapContainer: FC<IProps> = ({
  preview,
  mapSettings,
  modal,
  updateMap,
  routes,
}) => {
  const [state, setState] = useMergeState({
    client: undefined,
    topics: [],
    messages: [],
  });
  useEffect(() => {
    if (routes) {
      startMqtt(routes, setState);
    }
    return () => {
      stopMqtt(state.client);
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
      />
    </div>
  );
};
export default MonitorMapContainer;
