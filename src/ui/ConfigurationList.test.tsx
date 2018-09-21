import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils'
import { MemoryRouter, MemoryRouterProps } from 'react-router';
import { create } from 'react-test-renderer';

import ConfigurationList, { IConfigurationListProps, IConfigurations } from 'src/ui/ConfigurationList';

const testConfigs: IConfigurations = {
  test: {
    displays: {
      'Test display': {
        name: 'test display',
        position: {
          lat: 7.5,
          lon: 30,
        },
        viewCarousel: [
          {
            displayTime: 4,
            view: {
              stops: {
                'HSL:4700210': {
                  gtfsId: 'HSL:4700210',
                },
                'HSL:4740217': {
                  gtfsId: 'HSL:4740217',
                },
              },
              title: {
                en: '',
                fi: 'Koivukylä etelä',
                jp: '',
                ru: '',
                se: '',
              },
              type: 'timedRoutes',
            },
          },
        ],
      },
    },
    name: 'Test configuration',
    position: {
      lat: 7.5,
      lon: 30,
    },
  },
};

const WrappedConfig = ({ memoryRouterProps, configProps }: { memoryRouterProps?: MemoryRouterProps, configProps: IConfigurationListProps } = { memoryRouterProps: {}, configProps: { configurations: testConfigs } }) => (
  <MemoryRouter {...memoryRouterProps}>
    <MockedProvider>
      <ConfigurationList {...configProps} />
    </MockedProvider>>
  </MemoryRouter>
);

it('renders a without crashing', () => {
  const renderer = create(
    <WrappedConfig
      configProps={{configurations: testConfigs}}
    />
  );
  renderer.unmount();
});
