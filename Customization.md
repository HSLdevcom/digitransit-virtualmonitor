# Customizing Virtual Monitor

The default theming is for HSL, but that might not be what you need. Here's instructions on what to change and where if you want to customize the virtual monitor for a different organization.

## API backend.

The GraphQL API endpoint is defined in `src/monitorConfig.js`.

## monitorConfig.js 

MonitorConfig.js hold all the relevant information for configuring virtual monitor's appereance and incoming data. FeedId string is meant for  `src/ui/logo/Logo.tsx` to change correct logo depending on url where the user is going to. uri is the  GraphQL API endpoint.

## Logo

Logo is in `src/ui/logo/Logo.tsx` which by default returns the logo depending on feedId, like tampere for example. You can create a new file for a new logo and have `src/ui/logo/Logo.tsx` import that too. The logo can be either JSX or an image tag or whatever you might want.

## Page title

Page title is in `public/index.html` in `<title>` -tag.

## manifest.json

`public/manifest.json` contains information on what to display when user creates a link to the page in a mobile phone. Remember to change the relevant fields here too.

## Default language and translations

`src/i18n.ts` has `lng: ` field in `i18n.init()` which defines the default language. Adding new or modifiying existing translations is done in the same file under the `resources.[twoLetterLanguageName]` field.

## Favicon

Favicon is defined in `public/manifest.json`.

## In-app title

`src/i18n.ts` has `titlebarTitle`, the translation string for the title diplayed in titlebar (currently Virtuaalimonitori).
