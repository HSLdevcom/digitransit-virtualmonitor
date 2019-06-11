import * as React from "react";
import { InjectedTranslateProps, translate } from "react-i18next";

import { IStop as LocalIStop } from 'src/ui/ConfigurationList'
import Logo from 'src/ui/Logo';
import StopName from 'src/ui/StopName';
import StopTimesList from 'src/ui/StopTimesList';
import { default as StopTimesRetriever, IStop, IStopTime, StopId, StopTimesRetrieverQueryResult } from "src/ui/StopTimesRetriever";
import Titlebar from "src/ui/Titlebar";
import TitlebarTime from 'src/ui/TitlebarTime';
import 'src/ui/Views/StopTimesView.css';

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

const stopTimeAbsoluteDepartureTime = (stopTime: IStopTime) => (60*60*24) * stopTime.serviceDay + stopTime.usedTime;

type ICombinedStopTimesViewProps = (IStopTimesViewPropsWithStopIds | IStopTimesViewPropsWithIStops) & InjectedTranslateProps;

const duplicatePruneMethods: {
  [pruneType: string]: (stopsTimes: ReadonlyArray<IStopTime>, stops: ReadonlyArray<StopId>) => IStopTime[],
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
            if (foundDuplicate.usedTime - curr.usedTime >= duplicateRouteTimeThresholdSeconds) {
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
    // TODO: needs to compare the following:
    //  A: Time to travel from display to earlier stop + but travel to later stop.
    //  B: Time to travel from display to later stop.
    throw Error('duplicatePruneMethods.byShortestTravelTime not implemented.');
  },
  byStopOrder: (stopsTimes: ReadonlyArray<IStopTime>, stops: ReadonlyArray<StopId>) => {
    return stopsTimes
      .reduce(
        (acc: IStopTime[], curr: IStopTime) => {
          const foundDuplicate = acc.find(stopTime => (stopTime.trip && curr.trip && stopTime.trip.gtfsId === curr.trip.gtfsId));
          if (foundDuplicate) {
            // Found a duplicate.
            if (foundDuplicate.usedTime - curr.usedTime >= duplicateRouteTimeThresholdSeconds) {
              // If time difference is big enough, show both since they are separate part of the same route.
              return [
                ...acc,
                curr
              ];
            }
            if (curr.stop && foundDuplicate.stop) {
              if (stops.findIndex(stop => stop === curr.stop!.gtfsId) < stops.findIndex(stop => stop === foundDuplicate.stop!.gtfsId)) {
                return [ // Current is earlier in stops list.
                  ...(acc.filter(stop => stop !== foundDuplicate)),
                  curr,
                ];
              } else {
                return acc; // Existing item is earlier in stops list.
              }
            } else {
              return acc;
            }
          }
          return [
            ...acc,
            curr
          ];
        },
        []
      );
  },
};

const StopTimesView: React.SFC<ICombinedStopTimesViewProps> = (props: ICombinedStopTimesViewProps) => {
  const stopIds = (props as IStopTimesViewPropsWithStopIds).stopIds
    || ((props as IStopTimesViewPropsWithIStops).stops.map(stop => stop.gtfsId))
    || [];
  const showStopColumn = stopIds.length == 1
  return (
    <div style={{ color: 'white', display: 'flex', flexDirection:'column' }}>
      <Titlebar>
        <Logo />
        <div style={{fontWeight:'bold', fontSize:'1.5em'}}>
          {stopIds.length > 1 ? props.t('stops') : props.t('stop')}
          {stopIds.length > 0 ? stopIds.map(stop => <StopName stopIds={[stop]}/> ) : null  }
        </div>
        <TitlebarTime />
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
            
              // Merge the stoptimes. Show each route only once. Filter out nulls and undefined. (not found)
              const mergedStopTimes = result.data.stops
                .filter(function (stop) {
                  return stop != null;
                })
                .reduce(
                  (acc: IStopTime[], curr:IStop) => [...acc, ...curr.stoptimesWithoutPatterns || []],
                  []
                );
                if(!mergedStopTimes || !Array.isArray(mergedStopTimes) || mergedStopTimes.length <= 0) {
                  return (<div>
                    {props.t('stopRetrieveNotFound', {stopIds})}
                  </div>)
                }

              const pruneMethod = duplicatePruneMethods.byStopOrder;
              const duplicatePrunedStopTimes = pruneMethod(mergedStopTimes, stopIds);
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
                        overrideStopName: foundIStop ? foundIStop.overrideStopName : undefined,
                      } as IStopTime['stop'],
                    });
                  }
                  return stopTime;
                });
              
              return (
                <StopTimesList
                  pierColumnTitle={props.pierColumnTitle}
                  stoptimesWithoutPatterns={finalStopTimes}
                  showStopColumn={showStopColumn}
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
