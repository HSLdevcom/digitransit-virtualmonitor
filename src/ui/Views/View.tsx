import * as React from "react";

import { ITimedRoutesView, IViewBase } from 'src/ui/ConfigurationList';
import { StopId } from 'src/ui/StopIncomingRetriever';
import TimedRoutesView from 'src/ui/Views/TimedRoutesView';

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
      const { displayedRoutes, pierColumnTitle, stops } : ITimedRoutesView = view as ITimedRoutesView;
      // const { stops } = otherProps as { stops: ReadonlyArray<StopId | IStop> };
      return (
        <TimedRoutesView
          displayedRoutes={displayedRoutes}
          pierColumnTitle={pierColumnTitle}
          stops={Object.values(stops)}
          title={view.title && view.title.fi}
        />
      );
    default:
      return (
      <div>
        {`Unknown view with title '${view.title}' of type ${view.type}`}
      </div>
      );
  }
};

export default View;
