import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import SNode, { SNodeFields } from 'src/graphQL/SNode';
import SStop from 'src/graphQL/SStop';
import SView, { SViewFields } from 'src/graphQL/SView';

const SStopTimesView = new GraphQLObjectType({
  fields: () => ({
    ...SNodeFields,
    ...SViewFields,
    pierColumnTitle: { type: GraphQLString },
    stops: {
      resolve: (root, {}) => root.stops,
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SStop)))
    },
  }),
  interfaces: () => [SNode, SView],
  name: 'StopTimesView',
});

export default SStopTimesView;
