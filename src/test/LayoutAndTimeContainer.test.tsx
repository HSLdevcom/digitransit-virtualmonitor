import React from 'react';
import { render } from '@testing-library/react';
import LayoutAndTimeContainer from '../ui/LayoutAndTimeContainer';
import { ConfigContext } from '../contexts';

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

const mockConfig = {
  colors: {
    primary: '#000000',
  },
};

const withContext = () => {
  return (
    <ConfigContext.Provider value={mockConfig}>
      <LayoutAndTimeContainer {...defaultProps} />
    </ConfigContext.Provider>
  );
};

it('should have default label visible', () => {
  const container = render(withContext());
  expect(
    container.container.getElementsByClassName('label')[0].innerHTML,
  ).toEqual('8');
});
