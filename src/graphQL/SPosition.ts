import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType } from "graphql";

const SPosition = new GraphQLObjectType({
  fields: {
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) },
  },
  name: 'Position',
});

export default SPosition;
