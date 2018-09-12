import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import SStop from 'src/graphQL/SStop';
import STranslatedString from "src/graphQL/STranslatedString";
import SView from 'src/graphQL/SView';

const STimedRoutesView = new GraphQLObjectType({
  fields: () => ({
    // ...SView.getFields(),
    stops: {
      resolve: (root, {}) => Object.values(root.stops),
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SStop)))
    },
    title: { type: new GraphQLNonNull(STranslatedString) },
    type: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
  interfaces: () => [SView],
  name: 'TimedRoutesView',
});

export default STimedRoutesView;
