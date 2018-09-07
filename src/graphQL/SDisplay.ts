import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from "graphql";

import SPosition from "./SPosition";
import SStop from "src/graphQL/SStop";
import STranslatedString from "src/graphQL/STranslatedString";

const SDisplay = new GraphQLObjectType({
  fields: {
    position: { type: SPosition },
    stops: {
      resolve: (root, {}) => Object.values(root.stops),
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SStop)))
    },
    title: { type: new GraphQLNonNull(STranslatedString) },
  },
  name: 'Display',
});

export const defaultValue = {
  views: [],
};

export default SDisplay;
