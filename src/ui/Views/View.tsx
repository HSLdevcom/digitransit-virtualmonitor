import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

import { IStopTimesView, IViewBase } from 'src/ui/ConfigurationList';
import StopTimesView from 'src/ui/Views/StopTimesView';

export interface IViewProps {
  view: IStopTimesView,
  [additionalProps: string]: any,
};

const View = ({ t, view }: { view: IViewBase } & WithTranslation) => {
  const { type }: { type: string } = view;

  switch (type) {
    case 'stopTimes':
      const { displayedRoutes, pierColumnTitle, stops, amount } : IStopTimesView = view as IStopTimesView;
      console.log(amount)
      return (
        <StopTimesView
          displayedRoutes={displayedRoutes || amount}
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
