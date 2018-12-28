# OTP Virtual monitor

Real-time, updating public transport info display that aggregates OpenTripPlanner schedules for multiple stops.

## Description and usage

Virtual monitor provides both the configuration and displaying of public transit stop data. Configurations are saved to as URL parameters, thus no server, login information, cookies or browser local storage is used. A bookmark should be good enough for most users.

### Creating a new display

A display can show either a single view, or multiple different views that are rotated after a specified time period. To create a new display, navigate to the link http://localhost:3000/quickDisplay.

The `Staattinen linkki` -link is a permanent link to the Virtual monitor view of current configuration. Please remember that after the link is copied, it will always show the same configuration, even if changes are made in the editor. Thus remember to always create a new link after each modification. The same is true for configurations. If you wish to modify a configuration later, copy the current URL when in the configuration editor.

### StopTimes view

Only a single view type `stopTime` is supported at this time. This view aggregates stop times for multiple stops from current time on. To add stops to the view, search for stops by the search field. There's a link to view the stop times for that stop only (here mainly for verifying that the correct stop is selected) and a button to add them to the view.

It's possible to give names to the stops and displays. Some stops have a pier or stop number provided by the OTP back-end, but self-assigned names might be clearer.

Stops can be moved up or down in the list. The ordering will select the stop displayed if the same route goes through multiple selected stops.

### Other view types

Other possible views can be coded later, like `webpage`, `image` or `information`.

## Setup

`npm install`

If using npm version <4, also run `npm run prepare`

## Compiling and running for development.

To run the express web server: `npm run start`

To access the virtual monitor: http://localhost:3000/

## Developing Virtual Monitor

See [main article](Developing.md).

## Current state of the GraphQL server.

Currently the GraphQL server is not used, as all state management is done locally on browser. The server code had been started at the start of the project before the decision to use only URL-configurations. The code still exists in case a user-account system with saved configurations is implemented at some point in the future.

The initial server code is available and can be used to examine the GraphQL schema with GraphiQL. To run the graphql server: `tsc && node build build/dist/graphQL/server.js`. To access GraphiQL: http://localhost:4000/

## Customization

Steps for customization for different organizations is detailed [separately](Customization.md).

## Deploying

### Google Cloud Platform

Within a project console first check out the repository into it and navigate to the project directory.

Run `npm install`.

Run `npm run build`.

`cd build && gcloud app deploy` to deploy.
