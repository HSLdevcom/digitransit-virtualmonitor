import { getConfig } from './util/getConfig';

const baseAPI = '/api';

function statusCheckedResult(result) {
  if (result.status > 399) {
    throw new Error(`Error: status ${result.status}`);
  }
  return result.json();
}

const fetchData = (path, options, signal = undefined) => {
  return new Promise((resolve, reject) => {
    const jsonResponse = !options.method || options.method === 'POST';
    fetch(`${baseAPI}/${path}`, {
      headers: {
        accepts: 'application/json',
      },
      ...options,
      signal: signal ?? undefined,
    })
      .then(result => (jsonResponse ? statusCheckedResult(result) : result))
      .then(json => resolve(json))
      .catch(e => {
        reject(e);
      });
  });
};

const monitorAPI = {
  getMapSettings(lang, signal = undefined) {
    return fetchData(`map/${lang}`, {}, signal);
  },
  getPing(signal = undefined) {
    const options = {
      method: 'GET',
    };
    return fetchData('status', options, signal);
  },
  getUser() {
    const options = {
      credentials: 'include',
    };
    return fetchData('user', options);
  },
  getFavourites() {
    return fetchData('user/favourites', {});
  },
  get(monitor, signal = undefined) {
    return fetchData(`monitor/${monitor}`, {}, signal);
  },
  isUserOwned(monitor, signal = undefined) {
    const options = {
      method: 'GET',
    };
    return fetchData(`userowned/${monitor}`, options, signal);
  },
  getStatic(monitor, signal = undefined) {
    return fetchData(`staticmonitor/${monitor}`, {}, signal);
  },
  getAllMonitorsForUser(signal) {
    const instanceName = getConfig().name;
    return fetchData(`usermonitors/${instanceName}`, {}, signal);
  },
  getMonitorsForUser(urls) {
    return fetchData(`usermonitors/${urls}`, {});
  },
  create(monitor) {
    const options = {
      method: 'PUT',
      body: JSON.stringify(monitor),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetchData(`monitor`, options);
  },
  decompress(base64string) {
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
    return fetchData(`decompress`, options);
  },
  createStatic(monitor) {
    const options = {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(monitor),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetchData(`staticmonitor`, options);
  },
  updateStatic(monitor) {
    const options = {
      method: 'POST',
      body: JSON.stringify(monitor),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetchData(`staticmonitor`, options);
  },
  deleteStatic(hash, url) {
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
    return fetchData(`staticmonitor`, options);
  },
};

export default monitorAPI;
