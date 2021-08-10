import { getCurrentSeconds } from '../time';
import { uniqBy } from 'lodash';

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
          arrivalDepartures.push(stp.pattern.code);
        }
        return s.pickupType !== 'NONE';
      }),
    );
  }
  stop.stoptimesForPatterns.forEach(stoptimeList => {
    if (
      !hiddenRoutes.includes(stoptimeList.pattern.code) &&
      !arrivalDepartures.includes(stoptimeList.pattern.code)
    ) {
      if (timeshift > 0) {
        departures.push(
          ...stoptimeList.stoptimes.filter(
            s =>
              s.serviceDay + s.realtimeDeparture >= currentSeconds + timeshift,
          ),
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

export const createDepartureArray = (views, stops, isStation = false) => {
  const defaultSettings = {
    hiddenRoutes: [],
    timeshift: 0,
  };
  const departures = [];
  const stringsToTranslate = [];
  const alerts = [];
  views.forEach((view, i) => {
    const alertArray = [];
    Object.keys(view.columns).forEach(column => {
      const departureArray = [];
      stops.forEach(stop => {
        const stopIndex = view.columns[column].stops
          .map(stop => stop.gtfsId)
          .indexOf(stop.gtfsId);
        if (stopIndex >= 0) {
          if (isStation) {
            stop.stops.forEach(s => {
              stringsToTranslate.push(...getTranslationStringsForStop(stop));
              alertArray.push(...s.alerts);
              s.routes.forEach(r => alertArray.push(...r.alerts))
            });
          } else {
            stringsToTranslate.push(...getTranslationStringsForStop(stop));
            alertArray.push(...stop.alerts);
            stop.routes.forEach(r => alertArray.push(...r.alerts))
          }
          const { hiddenRoutes, timeshift, showEndOfLine } = view.columns[
            column
          ].stops[stopIndex].settings
            ? view.columns[column].stops[stopIndex].settings
            : defaultSettings;
          departureArray.push(
            ...filterDepartures(stop, hiddenRoutes, timeshift, showEndOfLine),
          );
        }
      });
      const colIndex = column === 'left' ? 0 : 1;
      departures[i] = departures[i] ? departures[i] : [[], []];
      departures[i][colIndex] = departureArray;
    });
    alerts.push(uniqBy(alertArray, a => a.alertHeaderText));
  });
  console.log(alerts)
  return [stringsToTranslate, departures, alerts];
};
