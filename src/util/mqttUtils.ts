import mqtt from 'mqtt/dist/mqtt';
import settings from './realTimeUtils';

export const startMqtt = (routes, setState) => {
  const client = mqtt.connect('wss://mqtt.digitransit.fi');
  setState({
    client: client,
  });
  const topics = routes.map(r => {
    return getTopic(r);
  });
  setState({
    topics: topics,
  });
  return import('./gtfsrt').then(bindings => {
    const feedReader = bindings.FeedMessage.read;
    client.on('connect', () => {
      client.subscribe(topics);
    });

    client.on('message', (topic, messages) => {
      const parsedMessages = parseFeedMQTT(
        feedReader,
        messages,
        topic,
        'tampere',
      );
      setState({
        messages: parsedMessages,
      });
    });
  });
};

export const stopMqtt = client => {
  if (client) {
    client.end();
  }
};

function getTopic(option) {
  const route = option.shortName;
  const direction = '+';
  const geoHash = ['+', '+', '+', '+'];
  const tripId = '+';
  // headsigns with / cause problems
  const headsign = '+';
  const tripStartTime = '+';
  const topic = settings.tampere.mqttTopicResolver(
    route,
    direction,
    tripStartTime,
    '+',
    headsign,
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
        };
        messages.push(message);
      }
    }
  });
  return messages.length > 0 ? messages : null;
};
