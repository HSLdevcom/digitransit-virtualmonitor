import React from 'react';
import { useCheckbox } from '@react-aria/checkbox';
import { useToggleState } from '@react-stately/toggle';
import { useFocusRing } from '@react-aria/focus';
import Icon from './Icon';

function Checkbox(props) {
  const state = useToggleState(props);
  const ref = React.useRef();
  const { inputProps } = useCheckbox(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  const img = `checkbox-${!state.isSelected ? 'un' : ''}checked${
    isFocusVisible ? '-focus' : ''
  }`;
  return (
    <label
      className="check-box"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <input {...inputProps} {...focusProps} ref={ref} />
      <Icon
        img={img}
        width={props.width ? props.width : 20}
        height={props.height ? props.height : 20}
        color={props.color ? props.color : 'none'}
        margin={props.margin ? props.margin : '0'}
      />
      {props.children}
    </label>
  );
}

export default Checkbox;
