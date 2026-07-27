import {
  filterDepartures,
  capitalize,
  getDepartureDestination,
  stringifyPattern,
  getBoundingBox,
  uuidValidateV5,
} from '../util/monitorUtils';

/**
 * Builds a minimal stop object for filterDepartures with a single scheduled
 * departure on a pattern whose route has the given mode.
 */
const makeStop = ({ vehicleMode, routeMode }) => ({
  vehicleMode,
  // getRenameID reads stop.patterns when the stop is passed as a single stop
  patterns: [],
  stoptimesForPatterns: [
    {
      pattern: {
        code: 'HSL:1019:0:01',
        headsign: 'Suomenlinna',
        stops: [],
        route: {
          gtfsId: 'HSL:1019',
          shortName: '19',
          longName: 'Kauppatori - Suomenlinna',
          mode: routeMode,
        },
      },
      stoptimes: [
        {
          pickupType: 'SCHEDULED',
          serviceDay: 1000,
          realtimeDeparture: 2000,
          trip: { tripHeadsign: 'Suomenlinna' },
        },
      ],
    },
  ],
});

const run = stop =>
  // stop, hiddenRoutes, timeshift, showEndOfLine, showStopNumber, showVia
  filterDepartures(stop, [], 0, false, false, true);

describe('filterDepartures - vehicleMode resolution', () => {
  it('uses the stop vehicleMode when it is available (lowercased)', () => {
    const departures = run(
      makeStop({ vehicleMode: 'FERRY', routeMode: 'BUS' }),
    );

    expect(departures).toHaveLength(1);
    expect(departures[0].vehicleMode).toBe('ferry');
  });

  it('falls back to the pattern route mode when the stop vehicleMode is missing', () => {
    const departures = run(
      makeStop({ vehicleMode: undefined, routeMode: 'FERRY' }),
    );

    expect(departures).toHaveLength(1);
    expect(departures[0].vehicleMode).toBe('ferry');
  });

  it('is undefined when neither the stop nor the route provides a mode', () => {
    const departures = run(
      makeStop({ vehicleMode: undefined, routeMode: undefined }),
    );

    expect(departures).toHaveLength(1);
    expect(departures[0].vehicleMode).toBeUndefined();
  });
});

describe('capitalize', () => {
  // happy path
  it('capitalizes the first word of a plain string', () => {
    expect(capitalize('suomenlinna')).toBe('Suomenlinna');
  });

  it('returns null/empty input untouched instead of throwing', () => {
    expect(capitalize(null)).toBeNull();
    expect(capitalize('')).toBe('');
  });

  it('only capitalizes the first word, leaving the rest lowercased', () => {
    expect(capitalize('kauppatori - suomenlinna')).toBe(
      'Kauppatori - suomenlinna',
    );
  });

  it('capitalizes across hyphens within the first word', () => {
    expect(capitalize('aleksis-kiven katu')).toBe('Aleksis-Kiven katu');
  });

  it('upper-cases the metro " (m)" marker', () => {
    expect(capitalize('rautatientori (m)')).toBe('Rautatientori (M)');
  });
});

describe('getDepartureDestination', () => {
  it('returns null when the departure is missing', () => {
    expect(getDepartureDestination(undefined, 'fi')).toBeNull();
  });

  it('prefers the language-specific headsign when present', () => {
    const departure = { headsign: 'Helsinki', headsignsv: 'Helsingfors' };
    expect(getDepartureDestination(departure, 'sv')).toBe('Helsingfors');
  });

  it('falls back to the base headsign when the language variant is missing', () => {
    const departure = { headsign: 'Helsinki' };
    expect(getDepartureDestination(departure, 'sv')).toBe('Helsinki');
  });

  it('uses trip.tripHeadsign when there is no headsign', () => {
    const departure = { trip: { tripHeadsign: 'Espoo' } };
    expect(getDepartureDestination(departure, 'fi')).toBe('Espoo');
  });

  it('uses trip.route.longName as the last resort', () => {
    const departure = { trip: { route: { longName: 'Kehärata' } } };
    expect(getDepartureDestination(departure, 'fi')).toBe('Kehärata');
  });

  it('returns null when no destination fields are set', () => {
    expect(getDepartureDestination({}, 'fi')).toBeNull();
  });
});

describe('stringifyPattern', () => {
  it('falls back to longName when the route has no shortName', () => {
    const pattern = {
      code: 'HSL:1019:0:01',
      headsign: 'suomenlinna',
      route: {
        gtfsId: 'HSL:1019',
        shortName: null,
        longName: 'Kauppatori - Suomenlinna',
      },
    };
    expect(stringifyPattern(pattern)).toBe(
      'HSL:1019:Kauppatori - Suomenlinna:Suomenlinna:0',
    );
  });
});

describe('getBoundingBox', () => {
  it('returns a zeroed box for an empty coordinate list', () => {
    expect(getBoundingBox([])).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it('ignores coordinates containing a falsy (0) component', () => {
    const box = getBoundingBox([
      [60.17, 24.94],
      [60.2, 24.83],
      [0, 0],
    ]);
    expect(box).toEqual([
      [60.17, 24.83],
      [60.2, 24.94],
    ]);
  });
});

describe('uuidValidateV5', () => {
  it('rejects a non-uuid string', () => {
    expect(uuidValidateV5('not-a-uuid')).toBe(false);
  });

  it('rejects a valid v4 uuid', () => {
    expect(uuidValidateV5('12345678-1234-4234-8234-1234567890ab')).toBe(false);
  });

  it('accepts a valid v5 uuid', () => {
    expect(uuidValidateV5('12345678-1234-5234-8234-1234567890ab')).toBe(true);
  });
});
