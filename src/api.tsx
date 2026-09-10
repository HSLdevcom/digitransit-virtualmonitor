import { getConfig } from './util/getConfig';
import { IMonitor, IUser, IFavourite } from './util/Interfaces';
import type { IOldMonitorDisplay } from './ui/OldMonitorParser';

const baseAPI = '/api';

interface IFetchOptions {
  method?: string;
  credentials?: string;
  body?: string;
  headers?: Record<string, string>;
}

function statusCheckedResult(result: Response): Promise<unknown> {
  if (result.status > 399) {
    throw new Error(`Error: status ${result.status}`);
  }
  return result.json();
}

const fetchData = <T,>(
  path: string,
  options: IFetchOptions,
  signal: AbortSignal = undefined,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const jsonResponse = !options.method || options.method === 'POST';
    fetch(`${baseAPI}/${path}`, {
      headers: {
        accepts: 'application/json',
      },
      ...options,
      signal: signal ?? undefined,
    } as RequestInit)
      .then(result => (jsonResponse ? statusCheckedResult(result) : result))
      .then(json => resolve(json as T))
      .catch(e => {
        reject(e);
      });
  });
};

const monitorAPI = {
  getMapSettings(lang: string, signal: AbortSignal = undefined) {
    return fetchData<string>(`map/${lang}`, {}, signal);
  },
  getPing(signal: AbortSignal = undefined) {
    const options = {
      method: 'GET',
    };
    return fetchData<Response>('status', options, signal);
  },
  getUser() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const options = {
      credentials: 'include',
    };
    return fetchData<IUser>('user', options, controller.signal).finally(() =>
      clearTimeout(timeoutId),
    );
  },
  getFavourites() {
    return fetchData<Array<IFavourite>>('user/favourites', {});
  },
  get(monitor: string, signal: AbortSignal = undefined) {
    return fetchData<IMonitor>(`monitor/${monitor}`, {}, signal);
  },
  isUserOwned(monitor: string, signal: AbortSignal = undefined) {
    const options = {
      method: 'GET',
    };
    return fetchData<Response>(`userowned/${monitor}`, options, signal);
  },
  getStatic(monitor: string, signal: AbortSignal = undefined) {
    return fetchData<IMonitor>(`staticmonitor/${monitor}`, {}, signal);
  },
  getAllMonitorsForUser(signal: AbortSignal = undefined) {
    const instanceName = getConfig().name;
    return fetchData(`usermonitors/${instanceName}`, {}, signal);
  },
  getMonitorsForUser(urls: string) {
    return fetchData(`usermonitors/${urls}`, {});
  },
  create(monitor: IMonitor) {
    const options = {
      method: 'PUT',
      body: JSON.stringify(monitor),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetchData<Response>(`monitor`, options);
  },
  decompress(base64string: string) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: base64string,
      }),
    };
    // Legacy pre-migration monitor format, not IMonitor — see OldMonitorParser's migrateMonitor
    return fetchData<IOldMonitorDisplay>(`decompress`, options);
  },
  createStatic(monitor: IMonitor) {
    const options = {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(monitor),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetchData<Response>(`staticmonitor`, options);
  },
  updateStatic(monitor: IMonitor) {
    const options = {
      method: 'POST',
      body: JSON.stringify(monitor),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetchData<IMonitor>(`staticmonitor`, options);
  },
  deleteStatic(hash: string, url: string) {
    const options = {
      method: 'DELETE',
      body: JSON.stringify({
        id: hash,
        url: url,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetchData<Response>(`staticmonitor`, options);
  },
};

export default monitorAPI;
