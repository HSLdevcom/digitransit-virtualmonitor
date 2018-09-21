import * as React from "react";

import { ITimedRoutesView, IViewBase } from 'src/ui/ConfigurationList';
import { IStop, StopId } from 'src/ui/StopIncomingRetriever';
import TimedRoutesView, { ITimedRoutesViewProps } from 'src/ui/Views/TimedRoutesView';

export interface IViewProps {
  view: ITimedRoutesView,
  [additionalProps: string]: any,
};

type ViewComponent =
  typeof TimedRoutesView
;

// const viewTypeMap: { [typeName: string]: { component: ViewComponent } } = {
//   'timedRoutes': {
//     component: TimedRoutesView,
//     foo: ITimedRoutesViewProps,
//   }
// };

const View = ({ view, ...additionalProps }: { view: IViewBase }) => {
  // const ViewComponent = viewTypeMap[view.type];
  // return (
  //   <ViewComponent
  //     {...additionalProps}
  //   />
  // );

  const { type, ...otherProps }: { type: string } = view;

  switch (type) {
    case 'timedRoutes':
      const { stops } = otherProps as { stops: ReadonlyArray<StopId | IStop> };
      return (
        <TimedRoutesView
        // pierColumnTitle={(view as ITimedRoutesView)}
          pierColumnTitle={'aaaa'}
          displayedRoutes={(otherProps as ITimedRoutesViewProps).displayedRoutes}
          stops={stops}
          overrideStopNames={(otherProps as ITimedRoutesViewProps).overrideStopNames}
          title={undefined}
        />
      );
    default:
      return (
      <div>
        {`Unknown view '${view.title}' of type ${view.type}`}
      </div>
      );
  }
};

export default View;
