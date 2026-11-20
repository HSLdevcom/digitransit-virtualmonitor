/// <reference types="node" />

interface Window {
  // Defined by HSL's Cookie Information consent platform (loaded in BannerHSL).
  // renew() reopens the cookie consent dialog.
  CookieConsent?: {
    renew?: () => void;
  };
  // Injected by the server from the X-Original-SaaS-Host request header.
  ORIGINAL_SAAS_HOST?: string;
}
