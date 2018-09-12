import * as React from "react";

import { IView, IViewBase } from 'src/ui/ConfigurationList';
import TimedRoutesView, { ITimedRoutesViewProps } from 'src/ui/Views/TimedRoutesView';

export interface IViewProps {
  view: IView,
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

const View = ({ view, ...additionalProps }: { view: IView }) => {
  // const ViewComponent = viewTypeMap[view.type];
  // return (
  //   <ViewComponent
  //     {...additionalProps}
  //   />
  // );

  switch (view.type) {
    case 'timedRoutes':
      return (
        <TimedRoutesView
          {...additionalProps as ITimedRoutesViewProps}
        />
      )
    default:
      return (
      <div>
        {`Unknown view '${view.title}' of type ${view.type}`}
      </div>
      );
  }
};

export default View;
