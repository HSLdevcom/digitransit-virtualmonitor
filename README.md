# Digitransit Stop Monitor

Real-time, updating public transport info display that aggregates OpenTripPlanner schedules for multiple stops.
Previously known as virtual monitor

## Description and usage

Stop monitor provides both the configuration and displaying of public transit stop data. Configurations are saved to Azure CosmosDB database and a static url is created for the monitor. Login system is implemented for HSL users only.

### Creating a new display

A display can show either a single view, or multiple different views that are rotated after a specified time period. To create a new display, navigate to the link http://localhost:3000/create. Or you can click a button from front page.

#### Non-logged in users
The link created in create view is a link to the Stop monitor view of current configuration. Please remember that after the link is copied, it will always show the same configuration, even if changes are made in the editor. Thus remember to always create a new link after each modification. You can also go back from the monitor view
when you move mouse over the monitor, then go back button appears.

#### Logged in users
The link created in create view is the link to the Stop monitor view. The link always stays the same. Changes can be made and saved and the view changes accordingly. 

### Monitor
Monitor aggregates stop times for multiple stops from current time on. To add stops to the view, search for stops by the search field. You can add more stops and edit the view 
multiple ways in configuration page.

It's possible to give names to the stops and displays. Some stops have a pier or stop number provided by the OTP back-end, but self-assigned names might be clearer.


### Alerts

Monitor also shows alerts for stops when available. There is also hidden functionality for viewing only alerts from selected stops. It can be accessed by hiding all the departures from all selected stops in the stop settings.

## Setup

`npm install && cd server/ && npm install`

Use node version 16.8.0 or later

## Compiling and running for development.

To run the front end of the app: `npm start` To run backend server `cd server/ && npm start`

The following parameters must be set to run/use the _backend_ server:  
MANAGEMENT_API_ID  
MANAGEMENT_API_SECRET  
REDIS_HOST  
REDIS_KEY  
REDIS_PORT  
APPSETTING_DB_ENDPOINT  
APPSETTING_DB_KEY  
APPSETTING_DB_ID  
APPSETTING_DB_CONTAINER  
OIDC_CLIENT_ID  
OIDC_CLIENT_SECRET  
OIDCHOST  
API_SUBSCRIPTION_QUERY_PARAMETER_NAME  
API_SUBSCRIPTION_TOKEN  

Set the REACT_APP_CONFIG parameter to change the _frontend_ theme. Check the available values in [getConfig.tsx](https://github.com/HSLdevcom/digitransit-virtualmonitor/blob/next/src/util/getConfig.tsx)

To access the stop monitor: http://localhost:3000/

GraphQL query types are generated with GraphQL code generator. If you want to make changes to the queries, run `npm run generate` in a terminal window to watch for updates.


## Customization

Steps for customization for different organizations is detailed [separately in Customisation.md](Customization.md).

## Deploying to Azure web app

See [Stopmonitor iac repo](https://github.com/HSLdevcom/digitransit-virtualmonitor-iac/)
