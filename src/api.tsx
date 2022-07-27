const baseAPI = '/api';

const fetchData = (path, options) => {
  return new Promise((resolve, reject) => {
    const get = !options.method || options.method === 'POST'
    fetch(`${baseAPI}/${path}`, {
      headers: {
        accepts: 'application/json',
      },
      ...options,
    })
      .then(result => get ? result.json() : result)
      .then(json => resolve(json))
      .catch(err => {
        reject(err);
      });
  });
}

const monitorAPI = {
  getUser() {
    const options = {
      credentials: 'include',
    }
    return fetchData('user', options);
  },
  getFavourites() {
    return fetchData('user/favourites', {});
  },
  get(monitor) {
    return fetchData(`monitor/${monitor}`, {});
  },
  isUserOwned(monitor) {
    const options = {
      method: 'GET',
    }
    return fetchData(`userowned/${monitor}`, options);
  },
  getStatic(monitor) {
    return fetchData(`staticmonitor/${monitor}`, {});
  },
  getAllMonitorsForUser() {
    return fetchData(`usermonitors`, {});
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
    }
    return fetchData(`monitor`, options);
  },
  getTranslations(ids) {
    return fetchData(`translations/${ids.join()}`, {});
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
    }
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
    }
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
    }
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
    }
    return fetchData(`staticmonitor`, options);
  },
};

export default monitorAPI;
