# OTP Virtual monitor

Real-time, updating public transport info display that aggregates OpenTripPlanner schedules for multiple stops.

## Setup

`npm install`

If using npm version <4, also run `npm run prepare`

## Compiling and running.

To run the express web server: `npm run start`

To access the virtual monitor: http://localhost:3000/

## Compiling and running the server.

Currently the server is not used, as all state management is done locally on browser.

However, the initial server code is available and can be used to examine the GraphQL schema.

To run the graphql server: `tsc && node build build/dist/graphQL/server.js`. This is currently mostly used for exploring the GraphQL schema.

To access GraphiQL: http://localhost:4000/
