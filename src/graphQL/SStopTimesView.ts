import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import SStop from 'src/graphQL/SStop';
import STranslatedString from "src/graphQL/STranslatedString";
import SView, { SViewFields } from 'src/graphQL/SView';
import SNode, { SNodeFields } from 'src/graphQL/SNode';

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
