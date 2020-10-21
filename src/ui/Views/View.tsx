import * as React from "react";
import { InjectedTranslateProps, translate } from 'react-i18next';

import { IStopTimesView, IViewBase } from 'src/ui/ConfigurationList';
import StopTimesView from 'src/ui/Views/StopTimesView';

export interface IViewProps {
  view: IStopTimesView,
  [additionalProps: string]: any,
};

const View = ({ t, view }: { view: IViewBase } & InjectedTranslateProps) => {
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

export default translate('translations')(View);
