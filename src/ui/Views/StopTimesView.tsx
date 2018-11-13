import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import AutoMoment from "src/ui/AutoMoment";
import { IStop as LocalIStop } from 'src/ui/ConfigurationList'
import Logo from 'src/ui/Logo';
import StopTimesList from 'src/ui/StopTimesList';
import { default as StopTimesRetriever, IStop, IStopTime, StopId, StopTimesRetrieverQueryResult } from "src/ui/StopTimesRetriever";
import Titlebar from "src/ui/Titlebar";

const duplicateRouteTimeThresholdSeconds = 15 * 60;

interface IStopTimesViewCommonProps {
  readonly title?: string,
  readonly displayedRoutes?: number,
  readonly pierColumnTitle?: string,
};

export interface IStopTimesViewPropsWithStopIds extends IStopTimesViewCommonProps {
  readonly stopIds: ReadonlyArray<StopId>,
};

export interface IStopTimesViewPropsWithIStops extends IStopTimesViewCommonProps {
  readonly stops: ReadonlyArray<LocalIStop>,
};

const stopTimeAbsoluteDepartureTime = (stopTime: IStopTime) => (60*60*24) * stopTime.serviceDay + stopTime.scheduledDeparture;

type ICombinedStopTimesViewProps = (IStopTimesViewPropsWithStopIds | IStopTimesViewPropsWithIStops) & InjectedTranslateProps;

const duplicatePruneMethods: {
  [pruneType: string]: (stopsTimes: ReadonlyArray<IStopTime> ) => IStopTime[],
} = {
  byFirstDeparture: (stopsTimes: ReadonlyArray<IStopTime>) => {
    // Takes into account date too, only useful for comparing.
  
    return Array.from(stopsTimes) // Create a copy for immutability
      // Sort by departure time.
      .sort((stopTimeA, stopTimeB) => stopTimeAbsoluteDepartureTime(stopTimeA) - stopTimeAbsoluteDepartureTime(stopTimeB))
      // Remove duplicate routes.
      .reduce(
        (acc: IStopTime[], curr: IStopTime) => {
          const foundDuplicate = acc.find(stopTime => (stopTime.trip && curr.trip && stopTime.trip.gtfsId === curr.trip.gtfsId));
          if (foundDuplicate) {
            // Found a duplicate.
            if (foundDuplicate.realtimeArrival - curr.realtimeArrival >= duplicateRouteTimeThresholdSeconds) {
              // If time difference is big enough, show both since they are separate part of the same route.
              return [
                ...acc,
                curr
              ]
            }
            // Leave the existing one, it should be earlier. (For now)
            return acc;
          }
          return [
            ...acc,
            curr
          ]
        },
        []
      );
  },
  byShortestTravelTime: (stopsTimes: ReadonlyArray<IStopTime>) => {
    throw Error('duplicatePruneMethods.byShortestTravelTime not implemented.');
  },
  byStopOrder: (stopsTimes: ReadonlyArray<IStopTime>) => {
    throw Error('duplicatePruneMethods.byStopOrder not implemented.');
  },
};

const StopTimesView: React.SFC<ICombinedStopTimesViewProps> = (props: ICombinedStopTimesViewProps) => {
  const stopIds = (props as IStopTimesViewPropsWithStopIds).stopIds
    || ((props as IStopTimesViewPropsWithIStops).stops.map(stop => stop.gtfsId))
    || [];

  return (
    <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
      <Titlebar>
        <Logo />
        <div id={"title-text"}>
          {props.title
            ? props.title
            : null /*<StopName stopIds={props.stops} />*/}
        </div>
        <div id={"title-time"}>
          <AutoMoment />
        </div>
      </Titlebar>
      { stopIds.length > 0
        ? (
          <StopTimesRetriever
            stopIds={stopIds}
          >
            {(result: StopTimesRetrieverQueryResult): React.ReactNode => {
              if (result.loading) {
                return (<div>{props.t('loading')}</div>);
              }
              if (!result || !result.data) {
                return (<div>
                  {props.t('stopRetrieveError', { stopIds })}
                </div>);
              }
              if (!result.data.stops || (result.data.stops.length <= 0)) {
                return (<div>
                  {props.t('stopRetrieveNotFound', { stopIds })}
                </div>);
              }
            
              // Merge the stoptimes. Show each route only once.
              const mergedStopTimes = result.data.stops
                .reduce(
                  (acc: IStopTime[], curr:IStop) => [...acc, ...curr.stoptimesWithoutPatterns || []],
                  []
                );

              const duplicatePrunedStopTimes = duplicatePruneMethods.byFirstDeparture(mergedStopTimes);

              const finalStopTimes = duplicatePrunedStopTimes
                .sort((stopTimeA, stopTimeB) => stopTimeAbsoluteDepartureTime(stopTimeA) - stopTimeAbsoluteDepartureTime(stopTimeB))
                // Clip to max of props.displayedRoutes
                .slice(0, props.displayedRoutes)
                // Map renamed stops from with possible overrideStopName configuration
                .map(stopTime => {
                  if ((props as IStopTimesViewPropsWithIStops).stops && stopTime.stop && stopTime.stop.gtfsId) {
                    const foundIStop: (LocalIStop | undefined) = (props as IStopTimesViewPropsWithIStops).stops.find(stop => stop.gtfsId === stopTime.stop!.gtfsId);
                    return ({
                      ...stopTime,
                      stop: {
                        ...stopTime.stop,
                        // gtfs: stopTime.stop!.gtfsId,
                        overrideStopName: foundIStop ? foundIStop.overrideStopName : undefined,
                        // platformCode: stopTime.stop!.gtfsId,
                      } as IStopTime['stop'],
                    });
                  }
                  return stopTime;
                });
              
              return (
                <StopTimesList
                  pierColumnTitle={props.pierColumnTitle}
                  stoptimesWithoutPatterns={finalStopTimes}
                  showPier={stopIds.length > 1}
                />
              );
            }}
          </StopTimesRetriever>
        )
        : (<div>
          {props.t('noStopsDefined')}
        </div>)
      }
    </div>
  );
};

StopTimesView.defaultProps = {
  displayedRoutes: 12,
};

// Terrible hack until @types/react-i18next is fixed.
export default translate('translations')(StopTimesView) as any as React.SFC<IStopTimesViewPropsWithStopIds | IStopTimesViewPropsWithIStops>;
