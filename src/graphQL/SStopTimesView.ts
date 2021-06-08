import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import SNode, { SNodeFields } from './SNode';
import SStop from './SStop';
import SView, { SViewFields } from './SView';

const SStopTimesView = new GraphQLObjectType({
  fields: () => ({
    ...SNodeFields,
    ...SViewFields,
    pierColumnTitle: { type: GraphQLString },
    stops: {
      resolve: (root, {}) => root.stops,
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SStop))),
    },
  }),
  interfaces: () => [SNode, SView],
  name: 'StopTimesView',
});

export default SStopTimesView;
