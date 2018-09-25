import * as React from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router';
import { create } from 'react-test-renderer';

import StopSelectorSwitch from 'src/ui/StopSelectorSwitch';

jest.mock('src/ui/StopsByNameRetriever', () => {
  return {
    default: 'StopsByNameRetriever'
  };
});

const WrappedStopSelector = ({ memoryRouterProps }: { memoryRouterProps?: MemoryRouterProps } = { memoryRouterProps: {} }) => (
  <MemoryRouter {...memoryRouterProps}>
    <StopSelectorSwitch />
  </MemoryRouter>
);

it('renders without crashing', () => {
  const renderer = create(
    <WrappedStopSelector />
  );
  renderer.unmount();
});

it('renders a StopsByNameRetriever with search phrase as param', () => {
  const renderer = create(
    <WrappedStopSelector memoryRouterProps={{ initialEntries: ['/searchStop/myPhrase']}} />
  );
  const stopsByNameRetriever = renderer.root.findByType('StopsByNameRetriever');
  expect(stopsByNameRetriever).toBeDefined();
  expect(stopsByNameRetriever.props).toMatchObject({ phrase: 'myPhrase' });
  renderer.unmount();
});
