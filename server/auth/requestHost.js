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
  if (trusted) {
    return trusted;
  }

  const forwarded = req.headers['x-forwarded-host'];
  const trustProxy = req.app?.get('trust proxy fn');
  if (
    allowedHosts.length === 0 &&
    typeof forwarded === 'string' &&
    /^[a-z0-9.:[\]-]+$/i.test(forwarded) &&
    hostOf(`http://${forwarded}`) &&
    trustProxy?.(req.socket.remoteAddress, 0)
  ) {
    return forwarded;
  }
  return req.headers.host;
}
