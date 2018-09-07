import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from "graphql";

import SStop from "src/graphQL/SStop";
import STranslatedString from "src/graphQL/STranslatedString";

const SView = new GraphQLObjectType({
  fields: {
    stops: {
      resolve: (root, {}) => Object.values(root.stops),
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SStop)))
    },
    title: { type: new GraphQLNonNull(STranslatedString) },
  },
  name: 'View',
});

export default SView;
