import mqtt from 'mqtt/dist/mqtt';
import settings from './realTimeUtils';

export const startMqtt = (routes, setState, setClient, topicRef) => {
  if (routes?.length === 0) {
    return;
  }
  const feed = routes[0]?.feedId;
  if (feed.toLowerCase() === 'hsl' || feed.toLowerCase() === 'digitraffic') {
    //Unsupported at the moment
    return;
  }
  const client = mqtt.connect('wss://mqtt.digitransit.fi');
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
      const parsedMessages = parseFeedMQTT(feedReader, messages, topic, feed);
      setState({
        messages: parsedMessages,
      });
    });
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
  );
  return topic;
}

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
  const messages = [];
  feed.entity.forEach(entity => {
    const vehiclePos = entity.vehicle;
    if (vehiclePos) {
      const { trip, position, vehicle } = vehiclePos;
      if (trip && position && vehicle) {
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
          shortName: shortName === '' ? undefined : shortName,
          color: color === '' ? undefined : color,
          topicString: topic,
        };
        messages.push(message);
      }
    }
  });
  return messages.length > 0 ? messages : null;
};

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
