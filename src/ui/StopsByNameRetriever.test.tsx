/* import { DocumentNode } from 'graphql';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils'
import { create } from 'react-test-renderer';

// const delay = (milliSeconds = 0) => new Promise(resolve => setTimeout(resolve, milliSeconds));

import StopsByNameRetriever, { IStopsByNameQuery, IStopsByNameRetrieverProps, STOPS_BY_NAME_QUERY } from './StopsByNameRetriever';

// This function exists mainly for better typesafety.
const mocker = <Request, Result>(query: DocumentNode, requestVariables: Request, resultData: Result) => ({
  request: {
    query,
    variables: requestVariables,
  },
  result: {
    data: resultData,
  },
});

const vars: IStopsByNameQuery = {
  phrase: 'Pasila'
};

const result = {
  stops: [
    {
      gtfsId: 'aaaa',
      name: 'TestStop',
    },
  ],
};

const mocks = [
  mocker(
    STOPS_BY_NAME_QUERY,
    vars,
    result
  ),
];

// const WrappedStopsByNameRetriever = (props: IStopsByNameRetrieverProps) => (
//   <MockedProvider mocks={mocks} addTypename={false} >
//     <StopsByNameRetriever {...props} />
//   </MockedProvider>
// );

// it('renders without crashing', () => {
//   const renderer = create(<WrappedStopsByNameRetriever phrase={'Pasila'} />);
//   renderer.unmount();
// });
 */