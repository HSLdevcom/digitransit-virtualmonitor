import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

import SPosition from "src/graphQL/SPosition";
// import STranslatedString from "src/graphQL/STranslatedString";
import SView from 'src/graphQL/SView';
import SNode, { SNodeFields } from 'src/graphQL/SNode';

const SViewWithDisplaySeconds = new GraphQLObjectType({
  fields: {
    ...SNodeFields,
    displaySeconds: {
      description: 'How many seconds the view is displayed on carousel.',
      type: new GraphQLNonNull(GraphQLInt),
    },
    view: { type: new GraphQLNonNull(SView) },
  },
  interfaces: () => [SNode],
  name: 'ViewWithDisplaySeconds',
});

const SDisplay = new GraphQLObjectType({
  fields: {
    ...SNodeFields,
    name: { type: GraphQLString },
    position: { type: SPosition },
    viewCarousel: {
      type: new GraphQLNonNull(new GraphQLList(SViewWithDisplaySeconds)),
    },
  },
  interfaces: () => [SNode],
  name: 'Display',
});

export const defaultValue = {
  views: [],
};

export default SDisplay;
