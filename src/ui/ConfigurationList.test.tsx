import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils'
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
            displaySeconds: 4,
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
              type: 'stopTimes',
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

const WrappedConfig = ({ configProps }: { configProps: IConfigurationListProps } = { configProps: { configurations: testConfigs } }) => (
  <MockedProvider>
    <ConfigurationList {...configProps} />
  </MockedProvider>
);

it('renders a without crashing', () => {
  const renderer = create(
    <WrappedConfig
      configProps={{configurations: testConfigs}}
    />
  );
  renderer.unmount();
});
