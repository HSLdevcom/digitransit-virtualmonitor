import React from 'react';
import LayoutModal from '../ui/LayoutModal';
import { mount } from 'enzyme';
import Modal from 'react-modal';

const defaultProps = {
  option: { rows: '16', value: '14', label: undefined },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSave: () => {},
  open: true,
  orientation: 'horizontal',
  ariaHideApp: false,
  allowInformationDisplay: true,
};

it('should render', () => {
  const wrapper = mount(<LayoutModal {...defaultProps} />);
  expect(wrapper.find(Modal)).toHaveLength(1);
});

it('renders content when modal is open', () => {
  const wrapper = mount(
    <LayoutModal {...defaultProps}>modal content</LayoutModal>,
  );
  expect(wrapper.find(Modal).text()).toBe(
    'close.svglayoutModalHeaderone-columnlayout1.svg4layout2.svg8layout3.svg12two-columnslayout4.svg4+4layout5.svg8+8layout6.svg12+12two-columns-combolayout7.svg4+8layout8.svg8+12layoutEastWestlayout9.svg4+4layout10.svg8+8layout11.svg12+12save',
  );
});
