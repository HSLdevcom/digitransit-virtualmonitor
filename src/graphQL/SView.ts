import { GraphQLInterfaceType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import STimedRoutesView from 'src/graphQL/STimedRoutesView';
import STranslatedString from "src/graphQL/STranslatedString";

const typeMap: { [typename: string]: GraphQLObjectType } = {
  'timedRoutes': STimedRoutesView,
};

const SView = new GraphQLInterfaceType({
  fields: {
    title: { type: new GraphQLNonNull(STranslatedString) },
    type: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  name: 'View',
  resolveType: (view) => typeMap[view.type],
});

export default SView;
