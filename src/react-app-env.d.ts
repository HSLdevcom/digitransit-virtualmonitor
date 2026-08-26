/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="vitest/globals" />

interface Window {
  // Defined by HSL's Cookie Information consent platform (loaded in BannerHSL).
  // renew() reopens the cookie consent dialog.
  CookieConsent?: {
    renew?: () => void;
  };
}
