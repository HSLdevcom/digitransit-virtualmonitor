# Customizing Virtual Monitor

The default themeing is for HSL, but that might not be what you need. Here's instructions on what to change and where if you want to customize the virtual monitor for a different organization.

## API backend.

The GraphQL API endpoint is defined in `src/index.tsx`.

## Logo

Logo is in `src/ui/Logo.tsx` which by default just re-exports `src/ui/HslLogo.tsx`. You can create a new file for a new logo and have `src/ui/Logo.tsx` import that instead. The logo can be either JSX or an image tag or whatever you might want.

## Page title

Page title is in `public/index.html` in `<title>` -tag.

## manifest.json

`public/manifest.json` contains information on what to display when user creates a link to the page in a mobile phone. Remember to change the relevant fields here too.

## Default language and translations

`src/i18n.ts` has `lng: ` field in `i18n.init()` which defines the default language. Adding new or modifiying existing translations is done in the same file under the `resources.[twoLetterLanguageName]` field.

## Favicon

Favicon is defined in `public/manifest.json`.

## In-app title

`src/App.tsx` has `<div id={"title-text"}>`, inside of which is the application title (currently Virtuaalimonitori).
