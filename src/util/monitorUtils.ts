import { getCurrentSeconds } from '../time';
import uniqBy from 'lodash/uniqBy';
import { IClosedStop } from './Interfaces';
import { XMLParser } from 'fast-xml-parser';
import { trainStationMap } from '../util/trainStations';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import dummyAlerts, { getDummyAlerts } from '../testAlert';
import SunCalc from 'suncalc';
import { IDeparture } from '../ui/MonitorRow';

export const namespace = 'd5a9e986-d6c3-4174-a160-9ac088145cc3';

const WEATHER_URL =
  'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::harmonie::surface::point::simple&timestep=5&parameters=temperature,WindSpeedMS,WeatherSymbol3';

const delay = ms =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const stopTimeAbsoluteDepartureTime = (stopTime: IDeparture) =>
  stopTime.serviceDay + stopTime.realtimeDeparture;

export const stringifyPattern = pattern => {
  return [
    pattern.route.gtfsId,
    pattern.route.shortName,
    capitalize(pattern.headsign),
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

export const stopsAndStationsFromViews = views => {
  const stopIds = [];
  const stationIds = [];
  const arr = Array.isArray(views) ? views : [views];
  const arr1 = arr.filter(v => v.type !== 'map');
  arr1.forEach(view => {
    Object.keys(view.columns).forEach(col => {
      view.columns[col].stops?.forEach(stop => {
        stop.locationType === 'STOP'
          ? stopIds.push(stop)
          : stationIds.push(stop);
      });
    });
  });
  return [stopIds, stationIds];
};
const getRenameID = (stops, item) => {
  let renamID = null;
  stops.forEach(stop => {
    const id = stop.patterns.find(
      s => s.headsign === item.trip?.tripHeadsign,
    )?.headsign;
    if (id) {
      renamID = id;
      return id;
    }
  });
  return renamID;
};

export const filterDepartures = (
  stop,
  hiddenRoutes,
  timeshift,
  showEndOfLine = false,
  showStopNumber,
  showVia,
) => {
  const departures = [];
  const currentSeconds = getCurrentSeconds();

  stop.stoptimesForPatterns.forEach(stoptimeList => {
    const stopList = stoptimeList.pattern.stops;
    const combinedPattern = stringifyPattern(stoptimeList.pattern);
    if (!hiddenRoutes.includes(combinedPattern)) {
      let stoptimes = [];
      stoptimeList.stoptimes.forEach(item => {
        const renameID = getRenameID(
          Array.isArray(stop.stops) ? stop.stops : [stop],
          item,
        );

        if (showEndOfLine || item.pickupType !== 'NONE') {
          stoptimes.push({
            ...item,
            combinedPattern: combinedPattern,
            showStopNumber: showStopNumber,
            showVia: showVia,
            vehicleMode: stop.vehicleMode?.toLowerCase(),
            renameID: renameID,
            stops: stopList,
          });
        }
      });

      if (timeshift > 0) {
        stoptimes = stoptimes.filter(s => {
          return (
            s.serviceDay + s.realtimeDeparture >=
            currentSeconds + (parseInt(timeshift) + 1) * 60
          );
        });
      }
      departures.push(...stoptimes);
    }
  });
  return departures;
};

export const createDepartureArray = (
  views,
  stops,
  isStation = false,
  t,
  fromStop = false,
  initTime,
) => {
  const defaultSettings = {
    hiddenRoutes: [],
    timeshift: 0,
    renamedDestinations: [],
  };
  const departures = [];
  const alerts = [];
  const closedStopViews: Array<IClosedStop> = [];

  views.forEach((view, i) => {
    Object.keys(view.columns).forEach(column => {
      const departureArray = [];
      stops.forEach(stop => {
        if (!stop) {
          return null;
        }
        const stopIndex = view.columns[column].stops
          .map(stop => stop.gtfsId)
          .indexOf(stop.gtfsId);
        let viewStop = view.columns[column].stops[stopIndex];
        viewStop = {
          ...viewStop,
          lat: stop.lat,
          lon: stop.lon,
        };
        if (!fromStop) {
          view.columns[column].stops[stopIndex] = viewStop;
        }
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
            lat: stop.lat,
            lon: stop.lon,
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
            const {
              hiddenRoutes,
              timeShift,
              showEndOfLine,
              showStopNumber,
              showVia,
            } = view.columns[column].stops[stopIndex].settings
              ? view.columns[column].stops[stopIndex].settings
              : defaultSettings;

            if (isStation) {
              stop.stops.forEach(s => {
                alerts.push(...s.alerts);
                s.routes.forEach(r => alerts.push(...r.alerts));
              });
            } else {
              alerts.push(...stop.alerts);
              stop.routes.forEach(r => alerts.push(...r.alerts));
            }
            departureArray.push(
              ...filterDepartures(
                stop,
                hiddenRoutes,
                timeShift,
                showEndOfLine,
                showStopNumber,
                showVia,
              ),
            );
          }
        }
      });
      const colIndex = column === 'left' ? 0 : 1;
      departures[i] = departures[i] ? departures[i] : [[], []];
      departures[i][colIndex] = uniqBy(
        departureArray
          .filter(d => d)
          .sort(
            (stopTimeA, stopTimeB) =>
              stopTimeAbsoluteDepartureTime(stopTimeA) -
              stopTimeAbsoluteDepartureTime(stopTimeB),
          ),
        departure => stoptimeSpecificDepartureId(departure),
      );
    });
  });
  let arr = alerts;
  if (process.env.NODE_ENV === 'development' && dummyAlerts.inUse) {
    arr = arr.concat(getDummyAlerts(initTime));
  }
  return [departures, arr, closedStopViews];
};

export function getWeatherData(time, lat, lon) {
  if (!lat || !lon) {
    return null;
  }
  const remainder = 5 - (time.minute % 5);
  const endtime = time
    .set({ seconds: 0 })
    .set({ milliseconds: 0 })
    .setZone('utc')
    .plus({ minutes: remainder });

  const searchTime = endtime;

  return (
    retryFetch(
      `${WEATHER_URL}&latlon=${lat},${lon}&starttime=${searchTime}&endtime=${searchTime}`,
      {},
      2,
      200,
    )
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .then(res => res.text())
      .then(str => {
        const options = {
          ignoreAttributes: true,
          ignoreNameSpace: true,
        };
        const parser = new XMLParser(options);
        return parser.parse(str);
      })
      .then(json => {
        const featureCollection = json['wfs:FeatureCollection']['wfs:member'];
        if (featureCollection) {
          const data = featureCollection.map(
            elem => elem['BsWfs:BsWfsElement'],
          );
          return data;
        }
        return null;
      })
      .catch(err => {
        throw new Error(`Error fetching weather data: ${err}`);
      })
  );
}

// Tries to fetch 1 + retryCount times until 200 is returned.
// Uses retryDelay (ms) between requests. url and options are normal fetch parameters
export const retryFetch = (URL, options = {}, retryCount, retryDelay) =>
  new Promise((resolve, reject) => {
    const retry = retriesLeft => {
      fetch(URL, options)
        .then(res => {
          if (res.ok) {
            resolve(res);
            // Don't retry if user is not logged in
          } else if (res.status === 401) {
            throw res.status;
          } else {
            // eslint-disable-next-line no-throw-literal
            throw `${URL}: ${res.statusText}`;
          }
        })
        .catch(async err => {
          if (retriesLeft > 0 && err !== 401) {
            await delay(retryDelay);
            retry(retriesLeft - 1);
          } else {
            reject(err);
          }
        });
    };
    retry(retryCount);
  });

export const checkDayNight = (iconId, timem, lat, lon) => {
  const dayNightIconIds = [1, 2, 21, 22, 23, 41, 42, 43, 61, 62, 71, 72, 73];
  const date = timem;
  const dateMillis = timem.ts;
  const sunCalcTimes = SunCalc.getTimes(date, lat, lon);
  const sunrise = sunCalcTimes.sunrise.getTime();
  const sunset = sunCalcTimes.sunset.getTime();
  if (
    (sunrise > dateMillis || sunset < dateMillis) &&
    dayNightIconIds.includes(iconId)
  ) {
    // Night icon = iconId + 100
    return iconId + 100;
  }
  return iconId;
};

export const capitalize = text => {
  if (text && text !== null) {
    const textArray = text.split(' ');
    const capitalized = textArray[0]
      .toLowerCase()
      .replace(/(^|[\s-])\S/g, function (match) {
        return match.toUpperCase();
      });
    textArray.splice(0, 1, capitalized);
    let retValue = textArray.join(' ');
    if (retValue.indexOf(' (m)') !== -1) {
      retValue = retValue.replace(' (m)', ' (M)');
    } else if (retValue.indexOf('(m)') !== -1) {
      retValue = retValue.replace('(m)', ' (M)');
    }
    return retValue;
  }
  return text;
};

export const getTrainStationData = (monitor, locationType) => {
  const retValue = [];
  const array = monitor.cards ? monitor.cards : monitor;
  array.forEach(card => {
    Object.keys(card.columns).forEach(column => {
      card.columns[column].stops?.forEach(stop => {
        const hasMode =
          stop.vehicleMode?.toLowerCase() === 'rail' ||
          stop.mode?.toLowerCase() === 'rail';
        if (stop.locationType === locationType && hasMode) {
          const isHsl = stop.gtfsId.startsWith('HSL:');
          const gtfsId = stop.gtfsId;
          retValue.push({
            gtfsId: gtfsId,
            shortCode: !isHsl
              ? gtfsId.substring(8)
              : trainStationMap?.find(i => i.gtfsId === gtfsId)?.shortCode ||
                null,
            source: isHsl ? 'HSL' : 'MATKA',
            hiddenRoutes: stop.settings?.hiddenRoutes || [],
            lat: stop.lat,
            lon: stop.lon,
          });
        }
      });
    });
  });
  return retValue;
};

export const isPlatformOrTrackVisible = monitor => {
  let showPlatformOrTrack = false;
  const array = monitor.cards ? monitor.cards : monitor;
  array.forEach(card => {
    Object.keys(card.columns).forEach(column => {
      card.columns[column].stops?.forEach(stop => {
        if (stop.settings && stop.settings.showStopNumber) {
          showPlatformOrTrack = true;
        }
      });
    });
  });
  return showPlatformOrTrack;
};

export const uuidValidateV5 = uuid => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 5;
};

export const stoptimeSpecificDepartureId = (departure: IDeparture) =>
  `${departure.trip.gtfsId}:${departure.serviceDay}:${departure.scheduledDeparture}`;

/**
 * Retrieves the departure destination based on the provided departure object and language.
 * @param departure - The departure object.
 * @param lang - The language code.
 * @returns The departure destination or null if not found.
 */
export const getDepartureDestination = (departure, lang) => {
  if (departure.headsign) {
    return departure['headsign' + lang]
      ? departure['headsign' + lang]
      : departure['headsign'];
  } else if (departure?.trip?.tripHeadsign) {
    return departure.trip['tripHeadsign' + lang]
      ? departure.trip['tripHeadsign' + lang]
      : departure.trip.tripHeadsign;
  } else if (departure.trip?.route?.longName) {
    return departure.trip.route['longName' + lang]
      ? departure.trip.route['longName' + lang]
      : departure.trip.route.longName;
  }
  return null;
};

type Coordinate = [number, number];
type BoundingBox = [Coordinate, Coordinate];

export function getBoundingBox(coordinates: Coordinate[]): BoundingBox {
  if (coordinates.length === 0) {
    return [
      [0, 0],
      [0, 0],
    ];
  }

  let minLat = coordinates[0][0];
  let maxLat = coordinates[0][0];
  let minLng = coordinates[0][1];
  let maxLng = coordinates[0][1];
  for (let i = 1; i < coordinates.length; i++) {
    const lat = coordinates[i][0];
    const lng = coordinates[i][1];

    if (lat && lng) {
      minLat = Math.min(minLat, lat);
      minLng = Math.min(minLng, lng);
      maxLat = Math.max(maxLat, lat);
      maxLng = Math.max(maxLng, lng);
    }
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}
