import { GraphQLInterfaceType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import SStopTimesView from 'src/graphQL/SStopTimesView';
import STranslatedString from "src/graphQL/STranslatedString";

const typeMap: { [typename: string]: GraphQLObjectType } = {
  'stopTimes': SStopTimesView,
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
