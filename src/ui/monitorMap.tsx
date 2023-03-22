import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, FC, useContext, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Icon from './Icon';
import { ConfigContext } from '../contexts';
import cx from 'classnames';
import { IMapSettings } from '../util/Interfaces';

interface IProps {
  preview?: boolean;
  mapSettings: IMapSettings;
  modal?: boolean;
  updateMap?: any;
  messages?: any;
}
const MonitorMap: FC<IProps> = ({
  preview,
  mapSettings,
  modal,
  updateMap,
  messages,
}) => {
  const config = useContext(ConfigContext);
  const [map, setMap] = useState();
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
      className: 'nameclass',
      html: ReactDOMServer.renderToString(
        <Icon img={stop.mode} color={color} />,
      ),
    });

    return { icon: icon, coords: stop.coords };
  });

  useEffect(() => {
    const newIcons = messages.map(m => {
      const icon = L.divIcon({
        className: 'nameclass',
        html: ReactDOMServer.renderToString(
          <Icon img={'layout1'} height={30} width={30} color={m.color} />,
        ),
      });
      return { id: m.id, icon: icon, coords: [m.lat, m.long] };
    });

    const newMarkers = newIcons.map(icon => {
      return {
        marker: L.marker(icon.coords, { icon: icon.icon }),
        id: icon.id,
      };
    });
    const markers = vehicleMarkers;
    newMarkers.forEach(element => {
      const exists = vehicleMarkers.find(v => {
        return v.id === element.id;
      });
      if (exists) {
        exists.marker.setLatLng(element.marker._latlng);
      } else {
        element.marker.addTo(map);
        markers.push(element);
      }
    });
    setVehicleMarkers(markers);
  }, [messages]);
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
            map.getBounds()._northEast.lat,
            map.getBounds()._northEast.lng,
          ];
          const SW = [
            map.getBounds()._southWest.lat,
            map.getBounds()._southWest.lng,
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
        if (map) {
          map.remove();
        }
      };
    }
  }, [map]);
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
