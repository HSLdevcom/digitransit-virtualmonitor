# OTP Virtual monitor

Real-time, updating public transport info display that aggregates OpenTripPlanner schedules for multiple stops.

## Setup

`npm install`

If using npm version <4, also run `npm run prepare`

## Compiling and running.

To run the graphql server: `tsc && node build build/dist/graphQL/server.js`

To run the express web server: `npm run start`

To access the virtual monitor: http://localhost:3000/

To access GraphiQL: http://localhost:4000/
