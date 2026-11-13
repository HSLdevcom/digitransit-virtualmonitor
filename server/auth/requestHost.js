// Proxy-supplied hosts are only used when they match a configured host.
export const hostOf = url => {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
};

export function requestHost(req, allowedHosts = []) {
  const trusted = [
    req.headers['x-original-saas-host'],
    req.headers['x-forwarded-host'],
  ].find(h => h && allowedHosts.includes(h));
  return trusted || req.headers.host;
}
