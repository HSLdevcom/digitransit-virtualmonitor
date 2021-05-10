import 'module-alias/register'; // Needs to be first

import { GraphQLServer } from 'graphql-yoga';

import virtualMonitorSchema from './schema';

const server = new GraphQLServer({ schema: virtualMonitorSchema })
server.start() // defaults to port 4000
