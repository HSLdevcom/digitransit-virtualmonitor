import { getCurrentSeconds } from '../time';
import { uniqBy } from 'lodash';
import { IClosedStop } from './Interfaces';

export const stringifyPattern = pattern => {
  return [
    pattern.route.gtfsId,
    pattern.route.shortName,
    pattern.headsign,
    pattern.code.split(':')[2],
  ].join(':');
};

export const getStopsAndStationsFromViews = views => {
  const stopIds = [];
  const stationIds = [];

  views.forEach(view => {
    Object.keys(view.columns).forEach(col => {
      view.columns[col].stops?.forEach(stop => {
        stop.locationType === 'STOP'
          ? stopIds.push(stop.gtfsId)
          : stationIds.push(stop.gtfsId);
      });
    });
  });

  return [stopIds, stationIds];
};

export const filterDepartures = (
  stop,
  hiddenRoutes,
  timeshift,
  showEndOfLine = false,
) => {
  const departures = [];
  const arrivalDepartures = [];
  const currentSeconds = getCurrentSeconds();

  if (!showEndOfLine && stop.stoptimesForPatterns) {
    stop.stoptimesForPatterns.forEach(stp =>
      stp.stoptimes.forEach(s => {
        if (s.pickupType === 'NONE') {
          arrivalDepartures.push(stringifyPattern(stp.pattern));
        }
        return s.pickupType !== 'NONE';
      }),
    );
  }
  stop.stoptimesForPatterns.forEach(stoptimeList => {
    const combinedPattern = stringifyPattern(stoptimeList.pattern);

    if (
      !hiddenRoutes.includes(combinedPattern) &&
      !arrivalDepartures.includes(combinedPattern)
    ) {
      if (timeshift > 0) {
        departures.push(
          ...stoptimeList.stoptimes.filter(s => {
            return (
              s.serviceDay + s.realtimeDeparture >=
              currentSeconds + parseInt(timeshift) * 60
            );
          }),
        );
      } else {
        departures.push(...stoptimeList.stoptimes);
      }
    }
  });
  return departures;
};
const getTranslationStringsForStop = stop => {
  const stringsToTranslate = [];
  stop.stoptimesForPatterns.forEach(stopTimeForPattern => {
    let headsign = stopTimeForPattern.stoptimes[0].headsign;
    if (headsign?.includes(' via ')) {
      const destinations = headsign.split(' via ');
      stringsToTranslate.push(...destinations);
    } else if (headsign?.endsWith(' via')) {
      headsign = headsign.substring(0, headsign.indexOf(' via'));
      stringsToTranslate.push(headsign);
    } else {
      if (headsign) {
        stringsToTranslate.push(headsign);
      }
    }
  });
  return stringsToTranslate;
};

export const createDepartureArray = (views, stops, isStation = false, t) => {
  const defaultSettings = {
    hiddenRoutes: [],
    timeshift: 0,
  };
  const departures = [];
  const stringsToTranslate = [];
  const alerts = [];
  const closedStopViews: Array<IClosedStop> = [];

  views.forEach((view, i) => {
    Object.keys(view.columns).forEach(column => {
      const departureArray = [];
      stops.forEach(stop => {
        const stopIndex = view.columns[column].stops
          .map(stop => stop.gtfsId)
          .indexOf(stop.gtfsId);
        const stopAlerts = [];
        if (!isStation) {
          stopAlerts.push(...stop.alerts);
        } else {
          stop.stops.forEach(s => {
            alerts.push(...s.alerts);
          });
        }
        if (
          stopIndex >= 0 &&
          stopAlerts.length === 1 &&
          stopAlerts[0].alertHeaderText === t('closedStop', { lng: 'fi' })
        ) {
          const closedStop: IClosedStop = {
            viewId: i + 1,
            column: column,
            gtfsId: stop.gtfsId,
            name: stop.name,
            code: stop.code,
            startTime: stopAlerts[0].effectiveStartDate,
            endTime: stopAlerts[0].effectiveEndDate,
          };
          closedStopViews.push(closedStop);
          if (
            stops.length > 1 ||
            (stops.length === 1 && view.layout >= 9 && view.layout < 12)
          ) {
            alerts.push(...stop.alerts);
          }
        } else {
          if (stopIndex >= 0) {
            if (isStation) {
              stop.stops.forEach(s => {
                stringsToTranslate.push(...getTranslationStringsForStop(stop));
                alerts.push(...s.alerts);
                s.routes.forEach(r => alerts.push(...r.alerts));
              });
            } else {
              stringsToTranslate.push(...getTranslationStringsForStop(stop));
              alerts.push(...stop.alerts);
              stop.routes.forEach(r => alerts.push(...r.alerts));
            }
            const { hiddenRoutes, timeShift, showEndOfLine } = view.columns[
              column
            ].stops[stopIndex].settings
              ? view.columns[column].stops[stopIndex].settings
              : defaultSettings;
            departureArray.push(
              ...filterDepartures(stop, hiddenRoutes, timeShift, showEndOfLine),
            );
          }
        }
      });
      const colIndex = column === 'left' ? 0 : 1;
      departures[i] = departures[i] ? departures[i] : [[], []];
      departures[i][colIndex] = uniqBy(
        departureArray,
        departure => departure.trip.gtfsId,
      );
    });
  });
  return [
    stringsToTranslate,
    departures,
    uniqBy(alerts, a => a.alertHeaderText),
    closedStopViews,
  ];
};

export const isInformationDisplay = cards => {
  return (
    cards.length === 1 &&
    cards[0].columns.left.stops.every(stop => stop.settings?.allRoutesHidden)
  );
};
