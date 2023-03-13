import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, FC, useContext } from 'react';
import ReactDOMServer from 'react-dom/server';
import Icon from './Icon';
import { ConfigContext, MapContext } from '../contexts';
import cx from 'classnames';

interface IProps {
  stopsForMap?: any;
  preview?: boolean;
  mapSettings: any;
}
const MonitorMap: FC<IProps> = ({ stopsForMap, preview, mapSettings }) => {
  const config = useContext(ConfigContext);
  const icons = stopsForMap.map(stop => {
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
    const center = mapSettings.center
      ? mapSettings.center
      : mapSettings.bounds[0];
    const zoom = mapSettings.zoom ? mapSettings.zoom : 14;
    const map: any = L.map('map', { zoomControl: false }).setView(center, zoom);
    L.tileLayer('https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png ', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    if (!mapSettings.center) {
      map.fitBounds(mapSettings.bounds);
    }
    icons.forEach(icon =>
      L.marker(icon.coords, { icon: icon.icon }).addTo(map),
    );
    /* map.on('move', () => {
      setmapSettings({
        center: map.getCenter(),
        zoom: map.getZoom(), // Center gets updated automatially when zooming in / out. But when moving, zoom does not.
      });
    });
    map.on('zoomend', () => {
      setmapSettings({
        zoom: map.getZoom(),
      });
    }); */
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);
  return (
    <div
      id="map"
      key="map"
      className={cx('monitormap', {
        preview: preview,
      })}
    ></div>
  );
};

export default MonitorMap;
