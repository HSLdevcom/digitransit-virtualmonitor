/// <reference types="node" />

interface Window {
  // Defined by HSL's Cookie Information consent platform (loaded in BannerHSL).
  // renew() reopens the cookie consent dialog.
  CookieConsent?: {
    renew?: () => void;
  };
}
