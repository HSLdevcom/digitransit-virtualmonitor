import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, FC, useContext, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Icon from './Icon';
import { ConfigContext } from '../contexts';
import cx from 'classnames';
import {
  BoundingBox,
  Coordinate,
  IMapSettings,
  IMessage,
} from '../util/Interfaces';
import VehicleIcon from '../Vehicleicon';
import { DateTime } from 'luxon';
import { changeTopics } from '../util/mqttUtils';
import monitorAPI from '../api';

interface IProps {
  preview?: boolean;
  mapSettings: IMapSettings;
  modal?: boolean;
  updateMap?: (settings: IMapSettings) => void;
  messages?: Array<IMessage>;
  clientRef: any;
  newTopics?: any;
  topicRef: any;
  departures?: any;
}
const getVehicleIcon = message => {
  const { heading, shortName, color } = message;
  return L.divIcon({
    className: 'vehicle',
    html: ReactDOMServer.renderToString(
      <VehicleIcon rotate={heading} color={color} vehicleNumber={shortName} />,
    ),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

function updateVehiclePosition(vehicle, icon, lat, long, timeStamp) {
  const marker = vehicle.marker;
  marker.setLatLng(new LatLng(lat, long));
  marker.setIcon(icon);
  vehicle.lastUpdatedAt = timeStamp;
}

function shouldShowVehicle(message, direction, tripStart, pattern, headsign) {
  return (
    !Number.isNaN(parseFloat(message.lat)) &&
    !Number.isNaN(parseFloat(message.long)) &&
    (pattern === undefined ||
      pattern.substr(0, message.route.length) === message.route) &&
    (headsign === undefined ||
      message.headsign === undefined ||
      headsign === message.headsign) &&
    (direction === undefined ||
      message.direction === undefined ||
      message.direction === +direction) &&
    (tripStart === undefined ||
      message.tripStartTime === undefined ||
      message.tripStartTime === tripStart)
  );
}

function getVehicle(departures, id) {
  const flatDeps = departures.flat();
  const veh = flatDeps.find(d => d.trip.route.gtfsId === id);
  if (veh) {
    const vehicleProps = {
      direction: veh.trip.directionId,
      tripStart: undefined,
      pattern: veh.trip.gtfsId,
      headsign: veh.headsign,
    };
    return vehicleProps;
  }
  return null;
}
const MonitorMap: FC<IProps> = ({
  preview,
  mapSettings,
  modal,
  updateMap,
  messages,
  clientRef,
  newTopics,
  topicRef,
  departures,
}) => {
  const config = useContext(ConfigContext);
  const [map, setMap] = useState<any>();
  const [vehicleMarkers, setVehicleMarkers] = useState([]);
  const feed = newTopics[0]?.feedId.toLowerCase();
  const EXPIRE_TIME_SEC = feed === 'hsl' ? 10 : 120; // HSL Uses different broker and we need to handle HSL messages differently
  const icons = mapSettings.stops.map(stop => {
    const color =
      config.modeIcons.colors[
        `${stop.mode
          ?.toLowerCase()
          .replace('stop', 'mode')
          .replace('station', 'mode')}`
      ];
    const icon = L.divIcon({
      className: 'stopIcon',
      html: ReactDOMServer.renderToString(
        <Icon img={stop.mode} color={color} width={30} height={30} />,
      ),
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    return { icon: icon, coords: stop.coords };
  });

  useEffect(() => {
    const center = mapSettings?.center
      ? mapSettings.center
      : mapSettings.bounds[0];
    const zoom = mapSettings.zoom ? mapSettings.zoom : 14;
    if (!map) {
      setMap(L.map('map', { zoomControl: false }).setView(center, zoom));
    } else {
      monitorAPI.getMapSettings().then((r: string) => {
        L.tileLayer(r, {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);
        map.fitBounds(mapSettings.bounds);
        icons.forEach(icon =>
          L.marker(icon.coords, { icon: icon.icon }).addTo(map),
        );
        map.on('move', () => {
          if (updateMap) {
            const NE: Coordinate = [
              map.getBounds().getNorthEast().lat,
              map.getBounds().getNorthEast().lng,
            ];
            const SW: Coordinate = [
              map.getBounds().getSouthWest().lat,
              map.getBounds().getSouthWest().lng,
            ];
            const bounds: BoundingBox = [NE, SW];
            updateMap({
              center: map.getCenter(),
              zoom: map.getZoom(),
              bounds: bounds,
            });
          }
        });
        map.on('zoomend', () => {
          if (updateMap) {
            updateMap({ zoom: map.getZoom() });
          }
        });
        return () => {
          if (map && map !== undefined) {
            map?.remove();
          }
        };
      });
    }
  }, [map]);

  useEffect(() => {
    const markers = vehicleMarkers ? vehicleMarkers : [];
    const stopIDs = mapSettings.stops.map(stop => stop.gtfsId);
    const now = DateTime.now().toSeconds();
    messages.forEach(m => {
      const { id, lat, long, next_stop, route } = m;
      const nextStop = stopIDs.includes(next_stop);
      const vehicle = getVehicle(departures, route);
      const exists = markers.find(marker => {
        return marker.id === id;
      });
      let marker;
      const showVehicle =
        route.split(':')[0] === 'HSL'
          ? shouldShowVehicle(
              m,
              vehicle.direction,
              vehicle.tripStart,
              vehicle.pattern,
              vehicle.headsign,
            )
          : true;
      if (exists && showVehicle) {
        updateVehiclePosition(exists, getVehicleIcon(m), lat, long, now);
        if (exists.nextStop) {
          exists.passed = nextStop ? false : true;
        } else if (nextStop && !exists.nextStop) {
          exists.nextStop = true;
        }
        //  exists.passed = nextStop ? false : undefined;
      } else if (showVehicle && !exists) {
        marker = {
          id: id,
          marker: L.marker([lat, long], {
            icon: getVehicleIcon(m),
          }),
        };
        marker.marker.addTo(map);
        markers.push(marker);
      }
      if (exists?.passed) {
        // Expiry handling. Mark those vehicles that have passed stop for expiry.
        // After a minute, remove vehicles from map.
        const marker = markers.find(marker => marker.id === id);
        if (marker) {
          if (marker.expire) {
            if (marker.expire <= now) {
              marker.remove = true;
            } else {
              updateVehiclePosition(marker, getVehicleIcon(m), lat, long, now);
            }
          } else {
            marker.expire = now + EXPIRE_TIME_SEC;
            updateVehiclePosition(marker, getVehicleIcon(m), lat, long, now);
          }
        }
      }
    });
    // Handle vehicle removoal
    const markersToRemove = [];
    const filtered = markers.filter(m => {
      if (now - m.lastUpdatedAt >= EXPIRE_TIME_SEC || m.remove) {
        markersToRemove.push(m.marker);
        return false;
      }
      return true;
    });
    if (markersToRemove.length > 0) {
      for (let index = 0; index < markersToRemove.length; index++) {
        map.removeLayer(markersToRemove[index]);
      }
      const settings = {
        oldTopics: topicRef.current,
        client: clientRef.current,
        options: newTopics,
      };
      changeTopics(settings, topicRef);
    }

    setVehicleMarkers(filtered);
  }, [messages]);

  return (
    <div
      id="map"
      key="map"
      className={cx('monitormap', {
        preview: preview,
        modal: modal,
      })}
    ></div>
  );
};

export default MonitorMap;
