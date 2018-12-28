# Developing Virtual Monitor

Virtual monitor is built on top of create-react-app-ts and uses React, Apollo, react-router and loona. It's written using typescript.

## Apollo, it's cache and Loona

Apollo is used for both retrieving the route data from backend and also for saving and modifying the local configurations during the browser runtime.

Since apollo already provides it's own store through apollo-cache, adding another state handler like redux would've been duplicating code. This would've been especially the case since the configurations were initially planned to be saved behind a GraphQL -based server.

Unfortunately, writing local cache modifying code was a lot more complicated and required a lot more code and boilerplate than initially estimated. Loona -library was introduced to help this, but ultimately the Loona library wasn't quite mature enough either and most of the local state handling remained a mess and the code is far from beautiful.

### Using Apollo to fetch data.

Apollo React components are mostly written that they only request the data from the server. They are provided a render function, which they will then run with the retrieved data. `StopTimesRetriever` is an example of this - it doesn't know anything at all about rendering the data - it doesn't even have a reference to `StopTimesList`. Instead, `StopTimesView` renders `StopTimesRetriever` and as a child for it, provides a function that handles the loading, errors and result state rendering. This allows using `StopTimesRetriever` code elsewhere with different render code.

## React-router

Router usage is pretty simple in this application. Most of the router logic resides in `App.tsx`.

## URL parameter compression

Since the whole configuration is in the URL, there is a need to reduce it's size. zlib is used with a predefined dictionary to compress the JSON configuration. If more configuration options are added, then it might be beneficial to add them to a new dictionary to help reduce URL length. It's important to not modify any existing dictionaries after they've been released once! This would break any existing links. If the dictionary is to be modified, add a new version /`v1`/ or /`v2`/ instead.
