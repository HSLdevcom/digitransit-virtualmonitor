import { GraphQLInterfaceType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import SStopTimesView from 'src/graphQL/SStopTimesView';
import STranslatedString from "src/graphQL/STranslatedString";

const typeMap: { [typename: string]: GraphQLObjectType } = {
  'stopTimes': SStopTimesView,
};

export const SViewFields = {
  title: { type: new GraphQLNonNull(STranslatedString) },
  type: {
    type: new GraphQLNonNull(GraphQLString),
  },
};

const SView = new GraphQLInterfaceType({
  fields: SViewFields,
  name: 'View',
  resolveType: (view) => typeMap[view.type],
});

export default SView;
