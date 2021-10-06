import React from 'react';
import { ReactComponent as ArrowDown } from './icons/arrow-down.svg';
import { ReactComponent as Check } from './icons/check.svg';
import { ReactComponent as Close } from './icons/close.svg';
import { ReactComponent as Delete } from './icons/delete.svg';
import { ReactComponent as Drag } from './icons/drag.svg';
import { ReactComponent as Edit } from './icons/edit.svg';
import { ReactComponent as Layout1 } from './icons/layout1.svg';
import { ReactComponent as Layout2 } from './icons/layout2.svg';
import { ReactComponent as Layout3 } from './icons/layout3.svg';
import { ReactComponent as Layout4 } from './icons/layout4.svg';
import { ReactComponent as Layout5 } from './icons/layout5.svg';
import { ReactComponent as Layout6 } from './icons/layout6.svg';
import { ReactComponent as Layout7 } from './icons/layout7.svg';
import { ReactComponent as Layout8 } from './icons/layout8.svg';
import { ReactComponent as Layout9 } from './icons/layout9.svg';
import { ReactComponent as Layout10 } from './icons/layout10.svg';
import { ReactComponent as Layout11 } from './icons/layout11.svg';
import { ReactComponent as Layout12 } from './icons/layout12.svg';
import { ReactComponent as Layout13 } from './icons/layout13.svg';
import { ReactComponent as Layout14 } from './icons/layout14.svg';
import { ReactComponent as Layout15 } from './icons/layout15.svg';
import { ReactComponent as Layout16 } from './icons/layout16.svg';
import { ReactComponent as Layout17 } from './icons/layout17.svg';
import { ReactComponent as StopBus } from './icons/stop-bus.svg';
import { ReactComponent as MoveDown } from './icons/move-down.svg';
import { ReactComponent as MoveUp } from './icons/move-up.svg';
import { ReactComponent as MoveBothDown } from './icons/move-both-down.svg';
import { ReactComponent as MoveBothUp } from './icons/move-both-up.svg';
import { ReactComponent as MoveDivider } from './icons/move-divider.svg';
import { ReactComponent as Rectangle } from './icons/rectangle.svg';
import { ReactComponent as RectangleSelected } from './icons/rectangle-selected.svg';
import { ReactComponent as Checkbox } from './icons/checkbox.svg';
import { ReactComponent as Settings } from './icons/settings.svg';
import { ReactComponent as Clock } from './icons/clock.svg';
import { ReactComponent as Airplane } from './icons/mode-airplane.svg';
import { ReactComponent as Bus } from './icons/mode-bus.svg';
import { ReactComponent as Ferry } from './icons/mode-ferry.svg';
import { ReactComponent as Metro } from './icons/mode-metro.svg';
import { ReactComponent as Rail } from './icons/mode-rail.svg';
import { ReactComponent as Tram } from './icons/mode-tram.svg';
import { ReactComponent as BusWaltti } from './icons/mode-bus-waltti.svg';
import { ReactComponent as FerryWaltti } from './icons/mode-ferry-waltti.svg';
import { ReactComponent as RailWaltti } from './icons/mode-rail-waltti.svg';
import { ReactComponent as TramWaltti } from './icons/mode-tram-waltti.svg';
import { ReactComponent as Alert } from './icons/alert.svg';
import { ReactComponent as Spinner } from './icons/spinner.svg';
import { ReactComponent as Weather1 } from './icons/weather/weather-1.svg';
import { ReactComponent as Weather2 } from './icons/weather/weather-2.svg';
import { ReactComponent as Weather3 } from './icons/weather/weather-3.svg';
import { ReactComponent as Weather21 } from './icons/weather/weather-21.svg';
import { ReactComponent as Weather22 } from './icons/weather/weather-22.svg';
import { ReactComponent as Weather23 } from './icons/weather/weather-23.svg';
import { ReactComponent as Weather31 } from './icons/weather/weather-31.svg';
import { ReactComponent as Weather32 } from './icons/weather/weather-32.svg';
import { ReactComponent as Weather33 } from './icons/weather/weather-33.svg';
import { ReactComponent as Weather41 } from './icons/weather/weather-41.svg';
import { ReactComponent as Weather42 } from './icons/weather/weather-42.svg';
import { ReactComponent as Weather43 } from './icons/weather/weather-43.svg';
import { ReactComponent as Weather51 } from './icons/weather/weather-51.svg';
import { ReactComponent as Weather52 } from './icons/weather/weather-52.svg';
import { ReactComponent as Weather53 } from './icons/weather/weather-53.svg';
import { ReactComponent as Weather61 } from './icons/weather/weather-61.svg';
import { ReactComponent as Weather62 } from './icons/weather/weather-62.svg';
import { ReactComponent as Weather63 } from './icons/weather/weather-63.svg';
import { ReactComponent as Weather64 } from './icons/weather/weather-64.svg';
import { ReactComponent as Weather71 } from './icons/weather/weather-71.svg';
import { ReactComponent as Weather72 } from './icons/weather/weather-72.svg';
import { ReactComponent as Weather73 } from './icons/weather/weather-73.svg';
import { ReactComponent as Weather81 } from './icons/weather/weather-81.svg';
import { ReactComponent as Weather82 } from './icons/weather/weather-82.svg';
import { ReactComponent as Weather83 } from './icons/weather/weather-83.svg';
import { ReactComponent as Weather91 } from './icons/weather/weather-91.svg';
import { ReactComponent as Weather92 } from './icons/weather/weather-92.svg';
import { ReactComponent as Weather101 } from './icons/weather/weather-101.svg';
import { ReactComponent as Weather102 } from './icons/weather/weather-102.svg';
import { ReactComponent as Weather121 } from './icons/weather/weather-121.svg';
import { ReactComponent as Weather122 } from './icons/weather/weather-122.svg';
import { ReactComponent as Weather123 } from './icons/weather/weather-123.svg';
import { ReactComponent as Weather141 } from './icons/weather/weather-141.svg';
import { ReactComponent as Weather142 } from './icons/weather/weather-142.svg';
import { ReactComponent as Weather143 } from './icons/weather/weather-143.svg';
import { ReactComponent as Weather161 } from './icons/weather/weather-161.svg';
import { ReactComponent as Weather162 } from './icons/weather/weather-162.svg';
import { ReactComponent as Weather171 } from './icons/weather/weather-171.svg';
import { ReactComponent as Weather172 } from './icons/weather/weather-172.svg';
import { ReactComponent as Weather173 } from './icons/weather/weather-173.svg';

export interface IIconMapProps {
  color?: string;
  fill?: string;
  height?: string;
  rotate?: string;
  stroke?: string;
  width?: string;
  borderRadius?: string;
}
export interface ICustomInputProps {
  color?: string;
  fill?: string;
  height?: number;
  img: string;
  rotate?: string;
  width?: number;
  borderRadius?: string;
}

const IconMap = (style: IIconMapProps) => {
  return {
    alert: <Alert style={style} />,
    'arrow-down': <ArrowDown style={style} />,
    check: <Check style={style} />,
    close: <Close style={style} />,
    delete: <Delete style={style} />,
    drag: <Drag style={style} />,
    edit: <Edit style={style} />,
    layout1: <Layout1 style={style} />,
    layout2: <Layout2 style={style} />,
    layout3: <Layout3 style={style} />,
    layout4: <Layout4 style={style} />,
    layout5: <Layout5 style={style} />,
    layout6: <Layout6 style={style} />,
    layout7: <Layout7 style={style} />,
    layout8: <Layout8 style={style} />,
    layout9: <Layout9 style={style} />,
    layout10: <Layout10 style={style} />,
    layout11: <Layout11 style={style} />,
    layout12: <Layout12 style={style} />,
    layout13: <Layout13 style={style} />,
    layout14: <Layout14 style={style} />,
    layout15: <Layout15 style={style} />,
    layout16: <Layout16 style={style} />,
    layout17: <Layout16 style={style} />,
    'stop-bus': <StopBus style={style} />,
    'move-down': <MoveDown style={style} />,
    'move-up': <MoveUp style={style} />,
    'move-both-down': <MoveBothDown style={style} />,
    'move-both-up': <MoveBothUp style={style} />,
    'move-divider': <MoveDivider style={style} />,
    rectangle: <Rectangle style={style} />,
    'rectangle-selected': <RectangleSelected style={style} />,
    checkbox: <Checkbox style={style} />,
    settings: <Settings style={style} />,
    spinner: <Spinner style={style} />,
    clock: <Clock style={style} />,
    airplane: <Airplane style={style} />,
    bus: <Bus style={style} />,
    ferry: <Ferry style={style} />,
    tram: <Tram style={style} />,
    rail: <Rail style={style} />,
    subway: <Metro style={style} />,
    'airplane-waltti': <Airplane style={style} />,
    'bus-waltti': <BusWaltti style={style} />,
    'ferry-waltti': <FerryWaltti style={style} />,
    'tram-waltti': <TramWaltti style={style} />,
    'rail-waltti': <RailWaltti style={style} />,
    'subway-waltti': <Metro style={style} />,
    weather1: <Weather1 style={style} />,
    weather2: <Weather2 style={style} />,
    weather3: <Weather3 style={style} />,
    weather21: <Weather21 style={style} />,
    weather22: <Weather22 style={style} />,
    weather23: <Weather23 style={style} />,
    weather31: <Weather31 style={style} />,
    weather32: <Weather32 style={style} />,
    weather33: <Weather33 style={style} />,
    weather41: <Weather41 style={style} />,
    weather42: <Weather42 style={style} />,
    weather43: <Weather43 style={style} />,
    weather51: <Weather51 style={style} />,
    weather52: <Weather52 style={style} />,
    weather53: <Weather53 style={style} />,
    weather61: <Weather61 style={style} />,
    weather62: <Weather62 style={style} />,
    weather63: <Weather63 style={style} />,
    weather64: <Weather64 style={style} />,
    weather71: <Weather71 style={style} />,
    weather72: <Weather72 style={style} />,
    weather73: <Weather73 style={style} />,
    weather81: <Weather81 style={style} />,
    weather82: <Weather82 style={style} />,
    weather83: <Weather83 style={style} />,
    weather91: <Weather91 style={style} />,
    weather92: <Weather92 style={style} />,
    weather101: <Weather101 style={style} />,
    weather102: <Weather102 style={style} />,
    weather121: <Weather121 style={style} />,
    weather122: <Weather122 style={style} />,
    weather123: <Weather123 style={style} />,
    weather141: <Weather141 style={style} />,
    weather142: <Weather142 style={style} />,
    weather143: <Weather143 style={style} />,
    weather161: <Weather161 style={style} />,
    weather162: <Weather162 style={style} />,
    weather171: <Weather171 style={style} />,
    weather172: <Weather172 style={style} />,
    weather173: <Weather173 style={style} />,
  };
};
/**
 * Icon renders predefined Svg icons as react component.
 * @example
 * <Icon
 *    img="bus"       // Key of svg, required
 *    height={24}      // Height as px, optional
 *    width={24}       // Width as px, optional
 *    color="#007ac9" // Color of image, optional
 *    rotate={90}     // How many degrees to rotate image, optional
 * />
 */
const Icon = (props: ICustomInputProps) => {
  let background = null;
  let fill = props.color;
  let height = props.height ? `${props.height}` : '24';
  let width = props.width ? `${props.width}` : '24';
  let stroke = null;
  if (props.img === 'stop-bus') {
    height = '32';
    width = '32';
  } else if (props.img === 'check') {
    fill = null;
    height = '18';
    width = '14';
    stroke = props.color;
  } else if (props.img && props.img.endsWith('-waltti')) {
    fill = null;
    background = props.color;
  }
  const style = {
    fill: fill,
    stroke: stroke,
    height: height,
    width: width,
    transform: props.rotate ? `rotate(${props.rotate}deg)` : null,
    background: background,
    borderRadius: props.borderRadius ? props.borderRadius : null,
  };

  const icons = IconMap(style);
  return <React.Fragment>{icons[props.img]}</React.Fragment>;
};

export default Icon;
