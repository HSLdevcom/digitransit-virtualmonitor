import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from "graphql";

import SPosition from "src/graphQL/SPosition";
import SStop from "src/graphQL/SStop";
import STranslatedString from "src/graphQL/STranslatedString";

const SView = new GraphQLObjectType({
  fields: {
    position: { type: SPosition },
    stops: {
      resolve: (root, {}) => Object.values(root.stops),
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SStop)))
    },
    title: { type: new GraphQLNonNull(STranslatedString) },
  },
  name: 'View',
});

export default SView;
