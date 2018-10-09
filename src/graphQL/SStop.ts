import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import SNode, { SNodeFields } from 'src/graphQL/SNode';

const SStop = new GraphQLObjectType({
  fields: {
    ...SNodeFields,
    gtfsId: { type: new GraphQLNonNull(GraphQLString) },
    overrideStopName: { type: GraphQLString },
  },
  interfaces: () => [SNode],
  name: 'Stop',
});

export default SStop;
