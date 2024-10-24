import mqtt from 'mqtt/dist/mqtt';
import settings from './realTimeUtils';
import { DateTime } from 'luxon';
import { sortAndFilter } from '../util/monitorUtils';

export const startMqtt = (routes, setState, setClient, topicRef) => {
  if (routes?.length === 0) {
    return;
  }
  const messageQueue = [];
  const batchDelay = 3000;

  function enqueueMessage(msg) {
    messageQueue.push(...msg);
  }

  function processBatch() {
    const currentBatch = messageQueue.splice(0, messageQueue.length);
    if (currentBatch.length > 0) {
      setState({
        messages: currentBatch,
      });
    }
    messageQueue.length = 0; // Empty the messageQueue
  }

  const feed = routes[0]?.feedId;
  const client = mqtt.connect(settings[feed].mqtt);
  setState({
    client: client,
  });
  setClient.current = client;
  const topics = routes.map(r => {
    return getTopic(r);
  });

  topicRef.current = topics;
  return import('./gtfsrt').then(bindings => {
    const feedReader = bindings.FeedMessage.read;
    client.on('connect', () => {
      client.subscribe(topics);
    });

    client.on('message', (topic, messages) => {
      let parsedMessages;
      if (settings[feed].gtfsrt) {
        parsedMessages = parseFeedMQTT(feedReader, messages, topic, feed);
      } else {
        const msgs = [];
        const msg = parseMessage(topic, messages, feed);
        if (msg) {
          msgs.push(msg);
          parsedMessages = msgs;
        }
      }
      if (parsedMessages) {
        enqueueMessage(parsedMessages);
      }
    });
    setInterval(processBatch, batchDelay);
  });
};

export function unsubscribe(client, topic) {
  if (client) {
    client.unsubscribe(topic);
  }
}
export const stopMqtt = (client, topics) => {
  if (client) {
    client.unsubscribe(topics);
    client.end();
  }
};

function getTopic(option) {
  const feed = option.feedId;
  const set = settings[feed];
  const route = option.route ? option.route : '+';
  const direction = '+';
  const geoHash = ['+', '+', '+', '+'];
  const tripId = option.tripId ? option.tripId : '+';
  const stop =
    feed.toLowerCase() === 'hsl' ? option.stop.gtfsId.split(':')[1] : '+';
  // headsigns with / cause problems
  const headsign = '+';
  const tripStartTime = '+';
  const topic = set.mqttTopicResolver(
    route,
    direction,
    tripStartTime,
    headsign,
    feed,
    tripId,
    geoHash,
    stop,
  );
  return topic;
}

const standardModes = ['bus', 'tram', 'ferry'];

const getMode = mode => {
  if (standardModes.includes(mode)) {
    return mode;
  }
  if (mode === 'train') {
    return 'rail';
  }
  if (mode === 'metro') {
    return 'subway';
  }
  // bus mode should be used as fallback if mode is not one of the standard modes
  return 'bus';
};

import ceil from 'lodash/ceil';
import Pbf from 'pbf';
export const parseFeedMQTT = (feedParser, data, topic, agency) => {
  const pbf = new Pbf(data);
  const feed = feedParser(pbf);
  // /gtfsrt/vp/<feed_Id>/<agency_id>/<agency_name>/<mode>/<route_id>/<direction_id>/<trip_headsign>/<trip_id>/<next_stop>/<start_time>/<vehicle_id>/<geo_hash>/<short_name>/<color>/
  const [
    ,
    ,
    ,
    ,
    ,
    ,
    mode,
    routeId,
    directionId,
    headsign,
    tripId,
    stopId,
    startTime,
    vehicleId,
    geoHashDeg1,
    geoHashDeg2,
    geoHashDeg3,
    geoHashDeg4,
    shortName,
    color,
  ] = topic.split('/');
  const entities = feed.entity ? feed.entity : feed;
  const messages = [];
  entities.forEach(entity => {
    const vehiclePos = entity.vehicle;
    if (vehiclePos) {
      // Digitraffic's train numbers are too long.
      const vehicleNumber =
        agency === 'digitraffic'
          ? shortName.indexOf(' ') !== -1
            ? shortName.split(' ')[1]
            : shortName
          : shortName;
      const { trip, position } = vehiclePos;
      if (trip && position) {
        const message = {
          id: `${agency}:${vehicleId}`,
          route: `${agency}:${routeId}`,
          direction:
            directionId === '' ? undefined : parseInt(directionId, 10) || 0,
          tripStartTime:
            startTime === '' ? undefined : startTime.replace(/:/g, ''),
          operatingDay: trip.start_date,
          mode: mode === '' ? 'bus' : mode.toLowerCase(),
          next_stop: stopId === '' ? undefined : `${agency}:${stopId}`,
          timestamp: vehiclePos.timestamp || feed.header.timestamp,
          lat: ceil(position.latitude, 5),
          long: ceil(position.longitude, 5),
          heading: position.bearing ? Math.floor(position.bearing) : undefined,
          headsign: headsign === '' ? undefined : headsign,
          tripId: tripId === '' ? undefined : `${agency}:${tripId}`,
          geoHash: [geoHashDeg1, geoHashDeg2, geoHashDeg3, geoHashDeg4],
          shortName: vehicleNumber === '' ? undefined : vehicleNumber,
          color: color === '' ? undefined : color,
          topicString: topic,
        };
        messages.push(message);
      }
    }
  });
  return messages.length > 0 ? messages : null;
};

interface IParseMsg {
  VP: any;
  lat: number;
  long: number;
  seq: number;
  oday: string;
  tsi: any;
  desi: string;
  hdg: any;
}
export function parseMessage(topic, message: any, agency) {
  let parsedMessage: IParseMsg;
  const [
    ,
    ,
    ,
    ,
    ,
    ,
    mode,
    ,
    id,
    line,
    dir,
    headsign, // eslint-disable-line no-unused-vars
    startTime,
    nextStop,
    ...rest // eslint-disable-line no-unused-vars
  ] = topic.split('/');
  const vehid = `${agency}_${id}`;
  if (message instanceof Uint8Array) {
    parsedMessage = JSON.parse(message.toString()).VP;
  } else {
    parsedMessage = message.VP;
  }
  if (
    parsedMessage &&
    parsedMessage.lat &&
    parsedMessage.long &&
    (parsedMessage.seq === undefined || parsedMessage.seq === 1) // seq is used for hsl metro carriage sequence
  ) {
    // change times from 24 hour system to 29 hour system, and removes ':'
    const tripStartTime =
      startTime &&
      startTime.length > 4 &&
      parseInt(startTime.substring(0, 2), 10) < 5
        ? `${parseInt(startTime.substring(0, 2), 10) + 24}${startTime.substring(
            3,
          )}`
        : startTime.replace(/:/g, '');
    return {
      id: vehid,
      route: `${agency}:${line}`,
      direction: parseInt(dir, 10) - 1,
      tripStartTime,
      operatingDay:
        parsedMessage.oday && parsedMessage.oday !== 'XXX'
          ? parsedMessage.oday
          : DateTime.now().toLocaleString(DateTime.DATE_SHORT),
      mode: getMode(mode),
      next_stop: `${agency}:${nextStop}`,
      timestamp: parsedMessage.tsi,
      lat: ceil(parsedMessage.lat, 5),
      long: ceil(parsedMessage.long, 5),
      shortName: parsedMessage.desi,
      heading: parsedMessage.hdg,
      headsign: undefined, // in HSL data headsign from realtime data does not always match gtfs data
    };
  }
  return undefined;
}

export function changeTopics(settings, topicRef) {
  const { client, oldTopics, options } = settings;
  let topicsByRoute;
  const topics = [];
  options.forEach(option => {
    const topicString = getTopic(option);
    if (option.route) {
      if (!topicsByRoute) {
        topicsByRoute = {};
      }
      topicsByRoute[option.route] = topicString;
    }
    topics.push(topicString);
  });
  // set new topic to store

  const { toSubscribe, toUnsubscribe } = compareTopics(
    oldTopics,
    topics,
    topicRef,
  );
  if (toUnsubscribe.length > 0) {
    client.unsubscribe(toUnsubscribe);
  }
  if (toSubscribe.length > 0) {
    client.subscribe(toSubscribe);
  }
}

function compareTopics(oldTopics, newTopics, topicRef) {
  const toSubscribe = [];
  const toUnsubscribe = [];

  for (const oldTopic of oldTopics) {
    if (!newTopics.includes(oldTopic)) {
      toUnsubscribe.push(oldTopic);
      topicRef.current = topicRef.current.filter(t => t !== oldTopic);
    }
  }

  for (const newTopic of newTopics) {
    if (!oldTopics.includes(newTopic)) {
      toSubscribe.push(newTopic);
      topicRef.current = [...topicRef.current, newTopic];
    }
  }

  return { toSubscribe, toUnsubscribe };
}

export function getMqttTopics(
  views,
  mapSettings,
  stationDepartures,
  stopDepartures,
  trainsWithTrack,
  offsetSeconds,
) {
  let initialTopics = [];
  if (mapSettings?.showMap) {
    // Todo. This is a hacky solution to easiest way of figuring out all the departures.
    // Map keeps record of all it's stops, so it has all their departures. This should be done
    // more coherent way when there is time.
    const allDep = [];

    const offsetWithBuffer = offsetSeconds + 120; // data might be a bit older than real time data so we add a buffer to keep the vehicles moving
    for (let i = 0; i < views.length; i++) {
      const element = [
        sortAndFilter(
          [...stationDepartures[i][0], ...stopDepartures[i][0]],
          trainsWithTrack,
          offsetWithBuffer,
        ),
        sortAndFilter(
          [...stationDepartures[i][1], ...stopDepartures[i][1]],
          trainsWithTrack,
          offsetWithBuffer,
        ),
      ];
      allDep.push(element);
    }

    const mapDepartures = allDep
      .map(o => o.flatMap(a => a))
      .reduce((a, b) => (a.length > b.length ? a : b));
    initialTopics = mapDepartures
      .filter(t => t.realtime)
      .map(dep => {
        const feedId = dep.trip.gtfsId.split(':')[0];
        const topic = {
          feedId: feedId,
          route: dep.trip.route?.gtfsId?.split(':')[1],
          tripId: dep.trip.gtfsId.split(':')[1],
          shortName: dep.trip.route.shortName,
          type: 3,
          ...dep,
        };
        if (feedId.toLowerCase() === 'hsl') {
          const i = dep.stops.findIndex(d => dep.stop.gtfsId === d.gtfsId);
          if (i !== dep.stops.length - 1) {
            const additionalStop = dep.stops[i + 1];
            topic.additionalStop = additionalStop;
          }
        }
        return topic;
      });
  }
  const topics = initialTopics;
  initialTopics.forEach(t => {
    if (t.additionalStop) {
      const additionalTopic = {
        ...t,
        stop: t.additionalStop,
        additionalStop: null,
      };
      topics.push(additionalTopic);
    }
  });
  return topics;
}
