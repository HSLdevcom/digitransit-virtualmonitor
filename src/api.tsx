const baseAPI = '/api';

const monitorAPI = {
  get(monitor) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/monitor/${monitor}`, {
        headers: {
          accepts: 'application/json',
        },
      })
        .then(result => result.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },
  getAllMonitorsForUser() {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/usermonitors`, {
        headers: {
          accepts: 'application/json',
        },
      })
        .then(result => result.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },
  getMonitorsForUser(urls) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/usermonitors/${urls}`, {
        headers: {
          // Accept: 'application/json',
          // 'Content-Type': 'application/json'
          accepts: 'application/json',
        },
      })
        .then(result => result.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err);
        });
    });
  },
  create(monitor) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/monitor`, {
        method: 'PUT',
        body: JSON.stringify(monitor),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(result => resolve(result))
        .catch(err => {
          reject(err);
        });
    });
  },
  getTranslations(ids) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/translations/${ids.join()}`, {
        headers: {
          accepts: 'application/json',
        },
      })
        .then(result => result.json())
        .then(result => resolve(result))
        .catch(err => {
          reject(err);
        });
    });
  },
  decompress(base64string) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/decompress`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: base64string,
        }),
      })
        .then(result => result.json())
        .then(result => resolve(result))
        .catch(err => {
          reject(err);
        });
    });
  },
  createStatic(hash, url, title) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/staticmonitor`, {
        method: 'PUT',
        body: JSON.stringify({
          id: hash,
          monitorContenthash: hash,
          name: title,
          url: url,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(result => resolve(result))
        .catch(err => {
          reject(err);
        });
    });
  },
  updateStatic(oldHash, url, newHash, title) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/staticmonitor`, {
        method: 'POST',
        body: JSON.stringify({
          id: oldHash,
          url: url,
          hash: newHash,
          name: title,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(result => resolve(result))
        .catch(err => {
          reject(err);
        });
    });
  },
  deleteStatic(hash, url) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/staticmonitor`, {
        method: 'DELETE',
        body: JSON.stringify({
          id: hash,
          url: url,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(result => resolve(result))
        .catch(err => {
          reject(err);
        });
    });
  },
};

export default monitorAPI;
