# Customizing Stop Monitor

The default theming is for Matka, and there is also theming for 
Jyvaskyla, and Tampere. But that might not be what you need. Here's instructions on what to change and where if you want to customize the stop monitor for a different organization.

##  backend.

The backend is defined in `server/`.

## monitorConfig.js 

MonitorConfig.js hold all the relevant information for configuring stop monitor's appereance and incoming data. FeedId string is meant for  `src/ui/logo/Logo.tsx` to change correct logo depending on url where the user is going to. uri is the  GraphQL API endpoint.


You can also edit primary colors and fonts used in different themes in this file as well.
## Logo

Logo is in `src/ui/logo/Logo.tsx` which by default returns the logo depending on feedId, like tampere for example. You can create a new file for a new logo and have `src/ui/logo/Logo.tsx` import that too. The logo can be either JSX or an image tag or whatever you might want.

## Page title

Page title is configurable in `src/App.tsx` below `<Helmet>` -component.

## manifest.json

`public/manifest.json` contains information on what to display when user creates a link to the page in a mobile phone. Remember to change the relevant fields here too.

## Default language and translations

`src/i18n.ts` has `lng: ` field in `i18n.init()` which defines the default language. Adding new or modifiying existing translations is done in the same file under the `resources.[twoLetterLanguageName]` field.

## Favicon

Favicons are defined in `src/ui/favicons/`.

