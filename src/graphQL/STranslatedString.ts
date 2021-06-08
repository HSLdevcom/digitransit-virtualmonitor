import { GraphQLObjectType, GraphQLString } from 'graphql';

const STranslatedString = new GraphQLObjectType({
  fields: {
    en: { type: GraphQLString },
    fi: { type: GraphQLString },
  },
  name: 'TranslatedString',
});

export default STranslatedString;
