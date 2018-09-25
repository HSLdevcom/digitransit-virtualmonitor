import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import AutoMoment from "src/ui/AutoMoment";
import HslLogo from "src/ui/HslLogo";
import { default as StopTimesRetriever, StopId, StopTimesRetrieverQueryResult, IStopTime } from "src/ui/StopTimesRetriever";
import { IStop } from "src/ui/ConfigurationList";
import StopName from "src/ui/StopName";
import Titlebar from "src/ui/Titlebar";
import StopTimesList from 'src/ui/StopTimesList';

interface ITimerRoutesViewCommonProps extends InjectedTranslateProps {
  readonly title?: string,
  readonly stops: ReadonlyArray<StopId> | ReadonlyArray<IStop>,
  readonly displayedRoutes?: number,
  readonly overrideStopNames?: {
    readonly [stopGtfsId: string]: string,
  },
  readonly pierColumnTitle?: string,
};

export interface ITimerRoutesViewPropsWithStopIds extends ITimerRoutesViewCommonProps {
  readonly stopIds: ReadonlyArray<StopId>,
};

export interface ITimerRoutesViewPropsWithIStops extends ITimerRoutesViewCommonProps {
  readonly stops: ReadonlyArray<IStop>,
};

const TimedRoutesView: React.StatelessComponent<ITimerRoutesViewPropsWithStopIds | ITimerRoutesViewPropsWithIStops> = (props: ITimerRoutesViewPropsWithStopIds | ITimerRoutesViewPropsWithIStops) => {
  let stopIds = (props as ITimerRoutesViewPropsWithStopIds).stopIds
    || ((props as ITimerRoutesViewPropsWithIStops).stops.map(stop => stop.gtfsId))
    || [];

  return (
    <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
      <Titlebar>
        <HslLogo />
        <div id={"title-text"}>
          {props.title
            ? props.title
            : null /*<StopName stopIds={props.stops} />*/}
        </div>
        <div id={"title-time"}>
          <AutoMoment />
        </div>
      </Titlebar>

      <StopTimesRetriever
        stopIds={stopIds}
      >
        {(result: StopTimesRetrieverQueryResult): React.ReactNode => {
          if (result.loading) {
            return (<div>{props.t('loading')}</div>);
          }
          if (!result || !result.data) {
            return (<div>
              {props.t('stopRetrieveError', { stopIds: stopIds })}
            </div>);
          }
          if (!result.data.stops || (result.data.stops.length <= 0)) {
            return (<div>
              {props.t('stopRetrieveNotFound', { stopIds: stopIds })}
            </div>);
          }
        
          // Takes into account date too, only useful for comparing.
          const calcAbsoluteDepartureTime = (stopTime: IStopTime) => (60*60*24) * stopTime.serviceDay + stopTime.scheduledDeparture;
        
          // Merge the stoptimes. Show each route only once.
          // Todo: Remove duplicates.
          // Todo: Prioritize stops for route that are closest to display position.
          const mergedStopTimes = result.data.stops
            .reduce(
              (acc, curr) => [...acc, ...curr.stoptimesWithoutPatterns || []],
              []
            )
            // Sort by departure time.
            .sort((stopTimeA, stopTimeB) => calcAbsoluteDepartureTime(stopTimeA) - calcAbsoluteDepartureTime(stopTimeB))
            // Clip to max of props.displayedRoutes
            .slice(0, props.displayedRoutes)
            // Map renamed stops from configuration
            .map(stopTime => (stopTime.stop && stopTime.stop.gtfsId && props.overrideStopNames && props.overrideStopNames[stopTime.stop.gtfsId])
              ? {
                ...stopTime,
                stop: {
                  ...stopTime.stop,
                  // gtfs: stopTime.stop!.gtfsId,
                  overrideStopName: props.overrideStopNames[stopTime.stop!.gtfsId],
                  // platformCode: stopTime.stop!.gtfsId,
                } as IStopTime['stop'],
              }
              : stopTime
            );
        
          return (
            <StopTimesList
              pierColumnTitle={props.pierColumnTitle}
              stoptimesWithoutPatterns={mergedStopTimes}
              showPier={stopIds.length > 1}
            />
          );
        }}
      </StopTimesRetriever>
    </div>
  );
};

TimedRoutesView.defaultProps = {
  displayedRoutes: 12,
  overrideStopNames: {},
};

export default translate('translations')(TimedRoutesView);
