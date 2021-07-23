import { getCurrentSeconds } from '../time';

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

export const getMaxAmountOfDeparturesForLayout = layout => {};

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

export const createDepartureArray = (views, stops, isStation = false) => {
  const defaultSettings = {
    hiddenRoutes: [],
    timeshift: 0,
  };
  const departures = [];
  const stringsToTranslate = [];
  views.forEach((view, i) => {
    Object.keys(view.columns).forEach(column => {
      const departureArray = [];
      stops.forEach(stop => {
        const stopIndex = view.columns[column].stops
          .map(stop => stop.gtfsId)
          .indexOf(stop.gtfsId);
        if (stopIndex >= 0) {
          if (isStation) {
            stop.stops.forEach(s => {
              s.routes.forEach(r => {
                stringsToTranslate.push(...r.patterns.map(p => p.headsign));
              });
            });
          } else {
            stop.patterns.forEach(r => {
              stringsToTranslate.push(r.headsign);
            });
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
  });
  return [stringsToTranslate, departures];
};
