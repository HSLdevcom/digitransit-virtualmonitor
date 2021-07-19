import { getCurrentSeconds } from '../time';

export const getStopsAndStationsFromViews = (views) => {
  const stopIds = [];
  const stationIds = [];

  views.forEach(view => {
    Object.keys(view.columns).forEach(col => {
      view.columns[col].stops?.forEach(stop => {
        stop.locationType === 'STOP' ? stopIds.push(stop.gtfsId) : stationIds.push(stop.gtfsId);
      })
    })
  })

  return [stopIds, stationIds];
}

export const getMaxAmountOfDeparturesForLayout = layout => {

}


export const getDeparturesWithoutHiddenRoutes = (stop, hiddenRoutes, timeshift) => {
  const departures = [];
  const currentSeconds = getCurrentSeconds();
  stop.stoptimesForPatterns.forEach(stoptimeList => {
    if (!hiddenRoutes.includes(stoptimeList.pattern.code)) {
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
