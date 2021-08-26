import { getCurrentSeconds } from '../time';
import { uniqBy } from 'lodash';
import { getAlertRowSpanForLayouts } from './getLayout';

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

const getAlerts = (hiddenRoutes, route) => {
  if (hiddenRoutes.length <= 0 || true) {
    return route.alerts;
  }
  if (route.patterns.some(p => hiddenRoutes.includes(stringifyPattern(p)))) {
    return [];
  }
  return route.alerts;
};

export const createDepartureArray = (views, stops, isStation = false) => {
  const defaultSettings = {
    hiddenRoutes: [],
    timeshift: 0,
  };
  const departures = [];
  const stringsToTranslate = [];
  const alerts = [];
  views.forEach((view, i) => {
    Object.keys(view.columns).forEach(column => {
      const departureArray = [];
      stops.forEach(stop => {
        const stopIndex = view.columns[column].stops
          .map(stop => stop.gtfsId)
          .indexOf(stop.gtfsId);
        if (stopIndex >= 0) {
          const { hiddenRoutes, timeShift, showEndOfLine } = view.columns[
            column
          ].stops[stopIndex].settings
            ? view.columns[column].stops[stopIndex].settings
            : defaultSettings;

          if (isStation) {
            stop.stops.forEach(s => {
              stringsToTranslate.push(...getTranslationStringsForStop(stop));
              alerts.push(...s.alerts);
              s.routes.forEach(r => alerts.push(...getAlerts(hiddenRoutes, r)));
            });
          } else {
            stringsToTranslate.push(...getTranslationStringsForStop(stop));
            alerts.push(...stop.alerts);
            stop.routes.forEach(r =>
              alerts.push(...getAlerts(hiddenRoutes, r)),
            );
          }
          departureArray.push(
            ...filterDepartures(stop, hiddenRoutes, timeShift, showEndOfLine),
          );
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
  ];
};
