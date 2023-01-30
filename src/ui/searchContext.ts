export function getSearchContext(config) {
  const searchContext = {
    URL_PELIAS: '/api/geocoding/search',
    URL_PELIAS_PLACE: '/api/geocoding/place',
    isPeliasLocationAware: false, // true / false does Let Pelias suggest based on current user location
    minimalRegexp: undefined, // used for testing min. regexp. For example: new RegExp('.{2,}'),
    lineRegexp: new RegExp(
      '(^[0-9]+[a-z]?$|^[yuleapinkrtdz]$|(^m[12]?b?$))',
      'i',
    ),
    feedIDs: config.feedIds, // FeedId's like  [HSL, HSLLautta]
    geocodingSources: ['oa', 'osm', 'nlsfi'], // sources for geocoding
    geocodingSearchParams: undefined, // Searchparmas fro geocoding
    getFavouriteLocations: () => ({}), // Function that returns array of favourite locations.
    getFavouriteStops: () => ({}), // Function that returns array of favourite stops.
    getLanguage: () => ({}), // Function that returns current language.
    getFavouriteRoutes: () => ({}), // Function that returns array of favourite routes.
    getPositions: () => ({}), // Function that returns user's geolocation.
    getRoutesQuery: () => ({}), // Function that returns query for fetching routes.
    getAllBikeRentalStations: () => ({}), // Function that returns all bike rental stations from graphql API.
    getStopAndStationsQuery: s => {
      return Promise.resolve(s);
    }, // Function that fetches favourite stops and stations from graphql API.
    getFavouriteRoutesQuery: () => ({}), // Function that returns query for fetching favourite routes.
    getFavouriteBikeRentalStations: () => ({}), // Function that returns favourite bike rental station.
    getFavouriteBikeRentalStationsQuery: () => ({}), // Function that returns query for fetching favourite bike rental stations.
    startLocationWatch: () => ({}), // Function that locates users geolocation.
    saveSearch: () => ({}), // Function that saves search to old searches store.
    clearOldSearches: () => ({}), // Function that clears old searches store.
    getFutureRoutes: () => ({}), // Function that return future routes
    saveFutureRoute: () => ({}), // Function that saves a future route
    clearFutureRoutes: () => ({}), // Function that clears future routes
  };

  return { ...searchContext };
}
