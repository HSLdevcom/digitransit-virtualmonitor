import React from 'react';
import LayoutModal from '../ui/LayoutModal';
import { mount } from 'enzyme';
import Modal from 'react-modal';
import { ConfigContext } from '../contexts';

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
const mockConfig = {
  colors: {
    primary: '#000000',
  },
};

const withContext = () => {
  return (
    <ConfigContext.Provider value={mockConfig}>
      <LayoutModal {...defaultProps} />
    </ConfigContext.Provider>
  );
};

it('should render', () => {
  const wrapper = mount(withContext());
  expect(wrapper.find(Modal)).toHaveLength(1);
});

it('renders content when modal is open', () => {
  const wrapper = mount(withContext());
  expect(wrapper.find(Modal).text()).toBe(
    'close.svglayoutModalHeaderone-columninfo-text-one-columnlayout1.svg4layout2.svg8layout3.svg12two-columnsinfo-text-two-columnslayout4.svg4+4layout5.svg8+8layout6.svg12+12layout7.svg4+8layout8.svg8+12layout-doubleinfo-text-doublelayout9.svg4+4layout10.svg8+8layout11.svg12+12information-displayinformation-display-infolayout18.svgsave',
  );
});
