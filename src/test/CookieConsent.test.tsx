let mockLanguage = 'fi';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: {
      language: mockLanguage,
      changeLanguage: (l: string) => {
        mockLanguage = l;
      },
    },
  }),
}));

jest.mock('@hsl-fi/site-header', () => ({
  SiteHeader: () => <div data-testid="site-header" />,
  UserMenu: () => null,
  QuickSearch: () => null,
}));

jest.mock('@hsl-fi/icons', () => ({
  Alert: () => <svg data-testid="alert-icon" />,
}));

jest.mock('../util/logoutUtil', () => ({ logout: jest.fn() }));

jest.mock('@hsl-fi/site-footer', () => ({
  SiteFooter: ({
    cookieSettingsButtonProps,
  }: {
    cookieSettingsButtonProps?: { onClick?: () => void };
  }) => (
    <button
      data-testid="cookie-settings-button"
      onClick={cookieSettingsButtonProps?.onClick}
    >
      cookie-settings
    </button>
  ),
}));

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ConfigContext, UserContext } from '../contexts';
import BannerHSL from '../ui/BannerHSL';
import FooterHSL from '../ui/FooterHSL';

const COOKIE_SCRIPT_SRC = 'https://policy.app.cookieinformation.com/uc.js';

const mockUser = { notLogged: true };

const renderBanner = (config: Record<string, unknown>) =>
  render(
    <ConfigContext.Provider value={config}>
      <UserContext.Provider value={mockUser}>
        <BannerHSL />
      </UserContext.Provider>
    </ConfigContext.Provider>,
  );

const renderFooter = (config: Record<string, unknown>) =>
  render(
    <ConfigContext.Provider value={config}>
      <FooterHSL />
    </ConfigContext.Provider>,
  );

afterEach(() => {
  document.getElementById('CookieConsent')?.remove();
  delete window.CookieConsent;
  mockLanguage = 'fi';
  jest.clearAllMocks();
});

describe('Cookie Information consent script', () => {
  it('injects the CookieConsent script when useCookiesPrompt is enabled', async () => {
    await act(async () => {
      renderBanner({ useCookiesPrompt: true, HSLUri: 'https://www.hsl.fi' });
    });

    const script = document.getElementById(
      'CookieConsent',
    ) as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script?.src).toBe(COOKIE_SCRIPT_SRC);
    expect(script?.getAttribute('data-gcm-version')).toBe('2.0');
    expect(script?.getAttribute('data-culture')).toBe('FI');
    expect(script?.type).toBe('text/javascript');
  });

  it('does not inject the script when useCookiesPrompt is not set', async () => {
    await act(async () => {
      renderBanner({ HSLUri: 'https://www.hsl.fi' });
    });

    expect(document.getElementById('CookieConsent')).toBeNull();
  });

  it('injects the script only once and updates data-culture on language change', async () => {
    const view = await act(async () =>
      renderBanner({ useCookiesPrompt: true, HSLUri: 'https://www.hsl.fi' }),
    );

    expect(
      document.getElementById('CookieConsent')?.getAttribute('data-culture'),
    ).toBe('FI');

    mockLanguage = 'sv';
    await act(async () => {
      view.rerender(
        <ConfigContext.Provider
          value={{ useCookiesPrompt: true, HSLUri: 'https://www.hsl.fi' }}
        >
          <UserContext.Provider value={mockUser}>
            <BannerHSL />
          </UserContext.Provider>
        </ConfigContext.Provider>,
      );
    });

    expect(document.querySelectorAll('#CookieConsent')).toHaveLength(1);
    expect(
      document.getElementById('CookieConsent')?.getAttribute('data-culture'),
    ).toBe('SV');
  });
});

describe('FooterHSL cookie settings button', () => {
  it('calls window.CookieConsent.renew when the platform is loaded', () => {
    const renew = jest.fn();
    window.CookieConsent = { renew };

    renderFooter({ HSLUri: 'https://www.hsl.fi' });
    fireEvent.click(screen.getByTestId('cookie-settings-button'));

    expect(renew).toHaveBeenCalledTimes(1);
  });

  it('does not throw when CookieConsent is not loaded', () => {
    renderFooter({ HSLUri: 'https://www.hsl.fi' });

    expect(() =>
      fireEvent.click(screen.getByTestId('cookie-settings-button')),
    ).not.toThrow();
  });
});
