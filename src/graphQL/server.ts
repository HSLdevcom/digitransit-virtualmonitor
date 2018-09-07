import 'module-alias/register';
// import { graphql } from "graphql";
// import gql from "graphql-tag";
import { GraphQLServer } from 'graphql-yoga';

import virtualMonitorSchema from 'src/graphQL/schema';

/* const TEST_QUERY = gql`
  query {
    configurations {
      name
    }
  }
`;
 */
// try {
//   graphql(virtualMonitorSchema, TEST_QUERY.loc.source);
//   // graphql(schema, TEST_QUERY.loc.source).then(res => { console.log(res); if (res && res.data) { console.log(res.data.configurations); } });
//   // console.log(await graphql(schema, TEST_QUERY.loc.source));
// } catch (ex) {
//   // console.log(ex);
// }

// const typeDefs = `
//   type Query {
//     hello: String!
//   }
// `

// const resolvers = {
//   Query: {
//     hello: (root, args, context, info) => 'Hello  World'
//   }
// }

const server = new GraphQLServer({ schema: virtualMonitorSchema })
server.start() // defaults to port 4000
