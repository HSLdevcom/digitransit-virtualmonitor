import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

import { IStopTimesView, IViewBase } from '../ConfigurationList';
import StopTimesView from './StopTimesView';

export interface IViewProps {
  view: IStopTimesView,
  [additionalProps: string]: any,
};

const View = ({ t, view }: { view: IViewBase } & WithTranslation) => {
  const { type }: { type: string } = view;

  switch (type) {
    case 'stopTimes':
      const { displayedRoutes, pierColumnTitle, stops } : IStopTimesView = view as IStopTimesView;

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
          {t('viewErrorUnknownView')}
        </div>
      );
  }
};

export default withTranslation('translations')(View);
