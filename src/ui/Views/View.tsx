import * as React from "react";

import { IStopTimesView, IViewBase } from 'src/ui/ConfigurationList';
import { StopId } from 'src/ui/StopTimesRetriever';
import StopTimesView from 'src/ui/Views/StopTimesView';

export interface IViewProps {
  view: IStopTimesView,
  [additionalProps: string]: any,
};

type ViewComponent =
  typeof StopTimesView
;

// const viewTypeMap: { [typeName: string]: { component: ViewComponent } } = {
//   'stopTimes': {
//     component: StopTimesView,
//     foo: IStopTimesViewProps,
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
    case 'stopTimes':
      const { displayedRoutes, pierColumnTitle, stops } : IStopTimesView = view as IStopTimesView;
      // const { stops } = otherProps as { stops: ReadonlyArray<StopId | IStop> };
      return (
        <StopTimesView
          displayedRoutes={displayedRoutes}
          pierColumnTitle={pierColumnTitle}
          stops={stops}
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
