import React from 'react';
import { render } from '@testing-library/react';
import LayoutAndTimeContainer from '../ui/LayoutAndTimeContainer';

const title = {
  fi: 'foo',
  sv: 'föö',
  en: 'bar',
};
const cardInfo = {
  feedIds: ['hsl'],
  index: 3,
  id: 1,
  layout: 2,
  duration: 3,
  title: title,
  possibleToMove: false,
};
const defaultProps = {
  cardInfo: cardInfo,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateCardInfo: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateLayout: () => {},
  allowInformationDisplay: true,
  orientation: 'horizontal',
  durationEditable: false,
};

it('should have default label visible', () => {
  const container = render(<LayoutAndTimeContainer {...defaultProps} />);
  expect(
    container.container.getElementsByClassName('label')[0].innerHTML,
  ).toEqual('8');
});
