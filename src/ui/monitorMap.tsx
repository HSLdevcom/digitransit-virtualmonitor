import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, FC, useContext, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Icon from './Icon';
import { ConfigContext } from '../contexts';
import cx from 'classnames';
import { IMapSettings } from '../util/Interfaces';
import VehicleIcon from '../Vehicleicon';
import { DateTime } from 'luxon';
import { changeTopics, unsubscribe } from '../util/mqttUtils';

interface IProps {
  preview?: boolean;
  mapSettings: IMapSettings;
  modal?: boolean;
  updateMap?: any;
  messages?: any;
  client?: any;
  currentState?: any;
  newTopics?: any;
  setState?: any;
}
const EXPIRE_TIME_SEC = 120;
const getVehicleIcon = message => {
  const { id, heading, mode, shortName, color } = message;
  return L.divIcon({
    className: 'vehicle',
    html: ReactDOMServer.renderToString(
      <VehicleIcon
        className={undefined}
        id={id}
        rotate={heading}
        color={color}
        vehicleNumber={shortName}
      />,
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

const MonitorMap: FC<IProps> = ({
  preview,
  mapSettings,
  modal,
  updateMap,
  messages,
  client,
  currentState,
  newTopics,
  setState,
}) => {
  const config = useContext(ConfigContext);
  const [map, setMap] = useState<any>();
  const [vehicleMarkers, setVehicleMarkers] = useState([]);
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
      L.tileLayer(
        'https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png ',
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          maxZoom: 18,
        },
      ).addTo(map);
      map.fitBounds(mapSettings.bounds);
      icons.forEach(icon =>
        L.marker(icon.coords, { icon: icon.icon }).addTo(map),
      );
      map.on('move', () => {
        if (updateMap) {
          const NE = [
            map.getBounds().getNorthEast().lat,
            map.getBounds().getNorthEast().lng,
          ];
          const SW = [
            map.getBounds().getSouthWest().lat,
            map.getBounds().getSouthWest().lng,
          ];
          const bounds = [NE, SW];
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
    }
  }, [map]);

  useEffect(() => {
    let markers = vehicleMarkers ? vehicleMarkers : [];
    const stopIDs = mapSettings.stops.map(stop => stop.gtfsId);
    const now = DateTime.now().toSeconds();
    messages.forEach(m => {
      const { id, lat, long, next_stop } = m;
      const nextStop = stopIDs.includes(next_stop);

      const exists = markers.find(marker => {
        return marker.id === id;
      });
      let marker;
      if (exists) {
        updateVehiclePosition(exists, getVehicleIcon(m), lat, long, now);
        if (exists.nextStop) {
          exists.passed = nextStop ? false : true;
        } else if (nextStop && !exists.nextStop) {
          exists.nextStop = true;
        }
        //  exists.passed = nextStop ? false : undefined;
      } else {
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
              markers.splice(marker.id, 1);
              const settings = {
                oldTopics: currentState.topics,
                client: currentState.client,
                options: newTopics,
              };
              changeTopics(settings, setState);
              markers = [];
              map.eachLayer(layer => {
                if (
                  layer.options.icon &&
                  layer.options.icon?.options.className === 'vehicle'
                ) {
                  layer.remove();
                }
              });
              // map.removeLayer(marker.marker);
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
    // Handle vehicles that does not receive new messages, i.e. vehicles reaching end of lines.
    markers.forEach(m => {
      if (now - m.lastUpdatedAt >= EXPIRE_TIME_SEC) {
        const settings = {
          oldTopics: currentState.topics,
          client: currentState.client,
          options: newTopics,
        };
        changeTopics(settings, setState);
        markers = [];
        map.eachLayer(layer => {
          if (
            layer.options.icon &&
            layer.options.icon?.options.className === 'vehicle'
          ) {
            layer.remove();
          }
        });
      }
      return m;
    });
    setVehicleMarkers(markers);
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
