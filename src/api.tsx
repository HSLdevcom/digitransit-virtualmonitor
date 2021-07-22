import { resolve } from '@loona/react';

const baseAPI = '/api';

const monitorAPI = {
  getAll() {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/monitors`, {
        headers: {
          accepts: 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => {
          return resolve(json);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  get(monitor) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/monitor/${monitor}`, {
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

  getMonitorsForUser(id) {
    return new Promise((resolve, reject) => {
      fetch(`${baseAPI}/usermonitors/${id}`, {
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
};

export default monitorAPI;
