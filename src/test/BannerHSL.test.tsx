vi.mock('@hsl-fi/site-header', () => ({
  SiteHeader: () => <div data-testid="site-header" />,
  UserMenu: () => null,
  QuickSearch: () => null,
}));

vi.mock('@hsl-fi/icons', () => ({
  AlertTriangleFilled: () => <svg data-testid="alert-icon" />,
}));

vi.mock('../util/logoutUtil', () => ({ logout: vi.fn() }));

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { ConfigContext, UserContext } from '../contexts';
import BannerHSL from '../ui/BannerHSL';

const mockUser = { notLogged: true };

const configWithBannersUri = {
  bannersUri: 'https://cms.hsl.fi/api/v1/banners?',
  HSLUri: 'https://www.hsl.fi',
  suggestionsUri: null,
};

const configWithoutBannersUri = {
  HSLUri: 'https://www.hsl.fi',
  suggestionsUri: null,
};

const mockFetch = (data: unknown) => {
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(data),
  } as Response);
};

const renderBannerHSL = (
  config: {
    bannersUri?: string;
    HSLUri: string;
    suggestionsUri: unknown;
  } = configWithBannersUri,
) =>
  render(
    <ConfigContext.Provider value={config}>
      <UserContext.Provider value={mockUser}>
        <BannerHSL />
      </UserContext.Provider>
    </ConfigContext.Provider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe('BannerHSL crisis banners', () => {
  it('renders the SiteHeader', async () => {
    mockFetch([]);
    await act(async () => {
      renderBannerHSL();
    });
    expect(screen.getByTestId('site-header')).toBeInTheDocument();
  });

  it('renders a Primary crisis banner fetched from bannersUri', async () => {
    mockFetch([{ priority: 'Primary', body: 'Alert body text' }]);
    const { container } = renderBannerHSL();
    await waitFor(() =>
      expect(screen.getByText('Alert body text')).toBeInTheDocument(),
    );
    expect(container.querySelector('.crisis-banner--primary')).toBeTruthy();
  });

  it('renders a Secondary crisis banner fetched from bannersUri', async () => {
    mockFetch([{ priority: 'Secondary', body: 'Info body' }]);
    const { container } = renderBannerHSL();
    await waitFor(() =>
      expect(screen.getByText('Info body')).toBeInTheDocument(),
    );
    expect(container.querySelector('.crisis-banner--secondary')).toBeTruthy();
  });

  it('renders multiple banners', async () => {
    mockFetch([
      { priority: 'Primary', body: 'First banner' },
      { priority: 'Secondary', body: 'Second banner' },
    ]);
    const { container } = renderBannerHSL();
    await waitFor(() =>
      expect(screen.getByText('First banner')).toBeInTheDocument(),
    );
    expect(screen.getByText('Second banner')).toBeInTheDocument();
    expect(container.querySelectorAll('.crisis-banner')).toHaveLength(2);
  });

  it('shows no banners when the API returns an empty array', async () => {
    mockFetch([]);
    const { container } = await act(async () => renderBannerHSL());
    expect(container.querySelectorAll('.crisis-banner')).toHaveLength(0);
  });

  it('does not fetch when bannersUri is not configured', async () => {
    global.fetch = vi.fn();
    await act(async () => {
      renderBannerHSL(configWithoutBannersUri);
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('renders banners above the SiteHeader', async () => {
    mockFetch([{ priority: 'Primary', body: 'Top banner' }]);
    const { container } = renderBannerHSL();
    await waitFor(() =>
      expect(screen.getByText('Top banner')).toBeInTheDocument(),
    );
    const banner = container.querySelector('.crisis-banner');
    const header = screen.getByTestId('site-header');
    expect(
      banner.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
