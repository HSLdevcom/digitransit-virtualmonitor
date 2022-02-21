import React from 'react';
import { screen, render } from '@testing-library/react';

import { IndexPage } from './IndexPage';

it('renders children without crashing', () => {
  render(<IndexPage t={key => key} />);

});


jest.mock('react-i18next', () => ({

  withTranslation: () => Component => {
   Component.defaultProps = { ...Component.defaultProps, t: () => "" };
   return Component;
   },
}));