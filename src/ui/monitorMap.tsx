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
  mapDepartures?: any;
  lang: string;
  vehicleMarkerState?: any;
  setVehicleMarkerState?: any;
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
  mapDepartures,
  lang,
  vehicleMarkerState,
  setVehicleMarkerState,
}) => {
  const config = useContext(ConfigContext);
  const [map, setMap] = useState<any>();
  const [vehicleMarkers, setVehicleMarkers] = useState([]);
  const EXPIRE_TIME_SEC = config.rtVehicleOffsetSeconds; // HSL Uses different broker and we need to handle HSL messages differently
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
      setMap(
        L.map('map', { zoomControl: false, zoomAnimation: false }).setView(
          center,
          zoom,
        ),
      );
    } else {
      monitorAPI.getMapSettings(lang).then((r: string) => {
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
    const markersOnMap = vehicleMarkers ? vehicleMarkers : [];
    const stopIDs = mapSettings.stops.map(stop => stop.gtfsId);
    const now = DateTime.now().toSeconds();
    const markerState = vehicleMarkerState;
    messages.forEach(m => {
      const { id, lat, long, next_stop, route } = m;
      const nextStop = stopIDs.includes(next_stop);
      const vehicle = getVehicle(mapDepartures, route);
      let existingMarker = markersOnMap.find(marker => {
        return marker.id === id;
      });
      const markerToRemove = markerState.get(id) || {};
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
      if (!!map && showVehicle && !existingMarker) {
        marker = {
          id: id,
          marker: L.marker([lat, long], {
            icon: getVehicleIcon(m),
          }),
        };
        marker.marker.addTo(map);
        markersOnMap.push(marker);
        existingMarker = marker;
      }

      if (existingMarker && showVehicle) {
        updateVehiclePosition(
          existingMarker,
          getVehicleIcon(m),
          lat,
          long,
          now,
        );

        if (markerToRemove.nextStop === true) {
          markerToRemove.passed = nextStop ? false : true;
        } else if (nextStop && !markerToRemove.nextStop) {
          markerToRemove.id = id;
          markerToRemove.nextStop = true;
        }

        if (markerToRemove.passed === true) {
          // Expiry handling. Mark those vehicles that have passed stop for expiry.
          // After the set time limit, remove vehicles from map.
          if (markerToRemove.id && !markerToRemove.expire) {
            markerToRemove.expire =
              DateTime.now().toSeconds() + EXPIRE_TIME_SEC;
          }
        }

        if (markerToRemove.id) {
          markerState.set(markerToRemove.id, markerToRemove);
        }
      }

      if (existingMarker && showVehicle) {
        updateVehiclePosition(
          existingMarker,
          getVehicleIcon(m),
          lat,
          long,
          DateTime.now().toSeconds(),
        );
      }
    });

    // Handle vehicle removal
    const currentSeconds = DateTime.now().toSeconds();
    const markersToRemove = [];
    const filtered = markersOnMap.filter(m => {
      if (
        markerState.get(m.id)?.expire <= currentSeconds ||
        currentSeconds - m.lastUpdatedAt >= EXPIRE_TIME_SEC // Remove vehicles that have not been updated for a while (likely reached the end of the line)
      ) {
        markerState.delete(m.id);
        markersToRemove.push(m.marker);
        return false;
      }
      return true;
    });
    if (markersToRemove.length > 0) {
      for (let index = 0; index < markersToRemove.length; index++) {
        const marker = markersToRemove[index];
        map.removeLayer(marker);
      }
    }

    setVehicleMarkers(filtered);
    if (markerState) {
      setVehicleMarkerState(markerState);
    }
  }, [messages, map]);

  useEffect(() => {
    if (topicRef?.current && clientRef?.current && newTopics) {
      const settings = {
        oldTopics: topicRef.current,
        client: clientRef.current,
        options: newTopics,
      };
      changeTopics(settings, topicRef);
    }
  }, [newTopics, topicRef]);

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
