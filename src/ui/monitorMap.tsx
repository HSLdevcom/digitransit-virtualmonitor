import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMergeState } from '../util/utilityHooks';
import React, { useRef, useEffect, useState, FC, useContext } from 'react';
import ReactDOMServer from 'react-dom/server';
import Icon from './Icon';
import { ConfigContext, MapContext } from '../contexts';
import Loading from './Loading';
interface IProps {
  coords?: any;
  bounds: any;
}
const MonitorMap: FC<IProps> = props => {
  const config = useContext(ConfigContext);
  const [state, setState] = useMergeState({
    map: useContext(MapContext),
  });
  const mapRef = useRef(null); // create a ref for the map element
  const centerRef = useRef(null); // create a ref for the center coordinate

  const icons = props.coords.map(coord => {
    const color =
      config.modeIcons.colors[
        `${coord.mode?.toLowerCase().replace('stop', 'mode')}`
      ];

    const icon = L.divIcon({
      className: 'kalpan-jaakiekkojoukkue',
      html: ReactDOMServer.renderToString(
        <Icon img={coord.mode} color={color} />,
      ),
    });

    return { icon: icon, coords: coord.coords };
  });
  useEffect(() => {
    const map: any = L.map('map', { zoomControl: false }).setView(
      props.bounds[0],
      1,
    );
    L.tileLayer('https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png ', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    map.fitBounds(props.bounds);
    icons.forEach(icon =>
      L.marker(icon.coords, { icon: icon.icon }).addTo(map),
    );
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return <div id="map" key="map" className="monitormap"></div>;
};

export default MonitorMap;
