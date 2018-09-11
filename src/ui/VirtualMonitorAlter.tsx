import * as React from "react";

import conf from "src/configPlayground";
import ViewCarousel from 'src/ui/ViewCarousel';
import VirtualMonitor from "src/ui/VirtualMonitor";

export interface IVirtualMonitorPropsAlter {
  title?: string,
  configuration: string,
  display: string,
};

const VirtualMonitorAlter = (props: IVirtualMonitorPropsAlter) => {
  const usedConfiguration = conf[props.configuration];
  if (!usedConfiguration) {
    return null;
  }
  const usedDisplay = usedConfiguration.displays[props.display] || usedConfiguration.displays.default || usedConfiguration.displays[0];
  if (!usedDisplay) {
    return null;
  }
  return (
    <ViewCarousel
      viewCarousel={usedDisplay.viewCarousel}
    />
    // <VirtualMonitor
    //   stops={Object.keys((usedDisplay.viewCarousel[0] || { view: { stops: [] } }).view.stops)}

    //   displayedRoutes={7}
    // />
  );
};

export default VirtualMonitorAlter;
