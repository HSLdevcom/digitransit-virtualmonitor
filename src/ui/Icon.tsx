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
import { ReactComponent as Bus } from './icons/bus-filled.svg';
import { ReactComponent as Tram } from './icons/tram-filled.svg';
import { ReactComponent as Train } from './icons/train-filled.svg';
import { ReactComponent as Metro } from './icons/metro-filled.svg';
import { ReactComponent as Alert } from './icons/alert.svg';
import { ReactComponent as Spinner } from './icons/spinner.svg';

export interface IIconMapProps {
  color?: string;
  fill?: string;
  height?: string;
  rotate?: string;
  stroke?: string;
  width?: string;
}
export interface ICustomInputProps {
  color?: string;
  fill?: string;
  height?: number;
  img: string;
  rotate?: string;
  width?: number;
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
    bus: <Bus style={style} />,
    tram: <Tram style={style} />,
    rail: <Train style={style} />,
    subway: <Metro style={style} />,
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
  }
  const style = {
    fill: fill,
    stroke: stroke,
    height: height,
    width: width,
    transform: props.rotate ? `rotate(${props.rotate}deg)` : null,
  };

  const icons = IconMap(style);
  return <React.Fragment>{icons[props.img]}</React.Fragment>;
};

export default Icon;
