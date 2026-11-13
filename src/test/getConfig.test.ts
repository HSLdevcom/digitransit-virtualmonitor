import { getConfig } from '../util/getConfig';

describe('getConfig', () => {
  const originalEnv = process.env.REACT_APP_CONFIG;

  beforeEach(() => {
    delete process.env.REACT_APP_CONFIG;
  });

  afterEach(() => {
    delete window.ORIGINAL_SAAS_HOST;
    if (originalEnv === undefined) {
      delete process.env.REACT_APP_CONFIG;
    } else {
      process.env.REACT_APP_CONFIG = originalEnv;
    }
  });

  it('selects the theme from ORIGINAL_SAAS_HOST when it is set', () => {
    window.ORIGINAL_SAAS_HOST = 'monitor.tremonitori.fi';
    expect(getConfig().name).toBe('tampere');
  });

  it('prefers ORIGINAL_SAAS_HOST over the browser hostname', () => {
    // jsdom hostname is "localhost", which would resolve to the hsl theme
    window.ORIGINAL_SAAS_HOST = 'www.matkamonitori.fi';
    expect(getConfig().name).toBe('matka');
  });

  it('falls back to the browser hostname when ORIGINAL_SAAS_HOST is not set', () => {
    expect(getConfig().name).toBe('hsl');
  });

  it('falls back to the browser hostname when ORIGINAL_SAAS_HOST is empty', () => {
    window.ORIGINAL_SAAS_HOST = '';
    expect(getConfig().name).toBe('hsl');
  });

  it('lets REACT_APP_CONFIG override ORIGINAL_SAAS_HOST', () => {
    process.env.REACT_APP_CONFIG = 'oulu';
    window.ORIGINAL_SAAS_HOST = 'monitor.tremonitori.fi';
    expect(getConfig().name).toBe('oulu');
  });
});
