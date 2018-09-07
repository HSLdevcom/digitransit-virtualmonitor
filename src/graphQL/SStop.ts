import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

const SStop = new GraphQLObjectType({
  fields: {
    gtfsId: { type: new GraphQLNonNull(GraphQLString) },
  },
  name: 'Stop',
});

export default SStop;
