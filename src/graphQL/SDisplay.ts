import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import SPosition from "src/graphQL/SPosition";
// import STranslatedString from "src/graphQL/STranslatedString";
import SView from 'src/graphQL/SView';

const SViewWithDisplayTime = new GraphQLObjectType({
  fields: {
    displayTime: { type: GraphQLFloat },
    view: { type: SView },
  },
  name: 'ViewWithDisplayTime',
});

const SDisplay = new GraphQLObjectType({
  fields: {
    name: { type: GraphQLString },
    position: { type: SPosition },
    viewCarousel: {
      type: new GraphQLNonNull(new GraphQLList(SViewWithDisplayTime)),
    },
  },
  name: 'Display',
});

export const defaultValue = {
  views: [],
};

export default SDisplay;
