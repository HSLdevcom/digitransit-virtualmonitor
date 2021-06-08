import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';

import ConfigurationList, {
  IConfigurationListProps,
  IConfigurations,
} from '../ui/ConfigurationList';

const testConfigs: IConfigurations = [
  {
    displays: [
      {
        id: 'Testing 1',
        name: 'test display',
        position: {
          lat: 7.5,
          lon: 30,
        },
        viewCarousel: [
          {
            displaySeconds: 4,
            id: 'Testing vc',
            view: {
              id: 'Testing v',
              displayedRoutes: 3,
              stops: [
                {
                  gtfsId: 'HSL:4700210',
                  id: 'Testing s1',
                },
                {
                  gtfsId: 'HSL:4740217',
                  id: 'Testing s2',
                },
              ],
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
    ],
    id: 'Testing c',
    name: 'Test configuration',
    position: {
      lat: 7.5,
      lon: 30,
    },
  },
];

const WrappedConfig = (
  { configProps }: { configProps: IConfigurationListProps } = {
    configProps: { configurations: testConfigs },
  },
) => (
  <MockedProvider>
    <ConfigurationList {...configProps} />
  </MockedProvider>
);

it('renders a without crashing', () => {
  const renderer = create(
    <WrappedConfig configProps={{ configurations: testConfigs }} />,
  );
  renderer.unmount();
});
