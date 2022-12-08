import axios from 'axios';
import monitorService from './monitorService.js';

const CLIENT_ID = process.env.MANAGEMENT_API_ID;
const CLIENT_SECRET = process.env.MANAGEMENT_API_SECRET;

export const isUserOwnedMonitor = async (req, res, next) => {
  try {
    const userMonitors = await getDataStorageMonitors(req, res, next);
    if (userMonitors.includes(req.params.id)) {
      res.status(200).send({ msg: 'OK' });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (err) {
    next(err);
  }
};

export const updateStaticMonitor = async (req, res, next) => {
  try {
    const userMonitors = await getDataStorageMonitors(req, res);
    if (userMonitors.includes(req.body.url)) {
      monitorService.updateStatic(req, res);
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (err) {
    next(err);
  }
};

export const getMonitors = async (req, res, next) => {
  try {
    const monitors = await getDataStorageMonitors(req, res);
    monitorService.getMonitorsForUser(req, res, next, monitors);
  } catch (err) {
    next(err);
  }
};

const getDataStorageMonitors = async (req, res) => {
  try {
    let dataStorage;
    dataStorage = await getDataStorage(req?.user);
    if (dataStorage) {
      const options = {
        endpoint: `/api/rest/v1/datastorage/${dataStorage.id}/data`,
      };
      const response = await makeOpenIdRequest(options, req?.user);
      return Object.keys(response.data).map((key) => key);
    }
    console.log("no data storage found, user doesn't have any monitors");
    return [];
  } catch (err) {
    throw err;
  }
};

export const deleteMonitor = async (req, res, next) => {
  try {
    const dataS = await getDataStorage(req.user);
    if (dataS) {
      const options = {
        endpoint: `/api/rest/v1/datastorage/${dataS.id}/data`,
      };
      const response = await makeOpenIdRequest(options, req.user);
      const monitors = Object.keys(response.data).map(key => key);
      if (monitors.includes(req.body.url)) {
        const response = await deleteMonitorHSL(dataS.id, req.body.url, req.user);
        await monitorService.deleteStatic(req, res);
      } else {
        res.status(401).send('Unauthorized');
      }
    }
  } catch (err) {
    next(err);
  }
};

export const createMonitor = async (req, res, next) => {
  try {
    const userId = req?.user?.data.sub;
    const dataStorage = {
      id: '',
    };
    let dataS = await getDataStorage(req?.user);
    if (dataS) {
      dataStorage.id = dataS.id;
      console.log('existing data storage found');
    } else {
      console.log('no data storage, creating one');
      dataS = await createDataStorage(userId);
      dataStorage.id = dataS;
    }
    const res = await updateMonitors(dataStorage.id, req.body, req.user, next);
  } catch (e) {
    next(e);
  }
};

const makeOpenIdRequest = async (options, user) => {
  try {
    const openIdUrls = JSON.parse(process.env.OIDCHOST);
    let openIdUrl;
    if (JSON.stringify(user.data).indexOf('hsl') !== -1) {
      console.log("HSL")
      openIdUrl = openIdUrls.hsl;
    } else {
      console.log("WALTTI")
      openIdUrl = openIdUrls.waltti;
    }
    const credentials = `Basic ${Buffer.from(
      `${CLIENT_ID}:${CLIENT_SECRET}`,
    ).toString('base64')}`;
    options.url = `${openIdUrl}${options.endpoint}`;
    options.headers = {
      Authorization: credentials,
      'Content-Type': 'application/json',
    };
    const response = axios(options);
    return response;
  } catch (err) {
    throw err;
  }
};
const deleteMonitorHSL = async (dataStorageId, monitor, user) => {
  try {
    const options = {
      method: 'DELETE',
      endpoint: `/api/rest/v1/datastorage/${dataStorageId}/data/${monitor}`,
    };
    const response = await makeOpenIdRequest(options, user);
    return response;
  } catch (err) {
    throw err;
  }
};

const updateMonitors = async (dataStorageId, monitor, user) => {
  try {
    const options = {
      method: 'PUT',
      endpoint: `/api/rest/v1/datastorage/${dataStorageId}/data/${monitor.url}`,
      data: { value: monitor.monitorContenthash },
    };
    const response = await makeOpenIdRequest(options, user);
    return response;
  } catch (err) {
    throw err;
  }
};

const createDataStorage = async user => {
  const id = user?.data.sub;
  const options = {
    method: 'POST',
    endpoint: '/api/rest/v1/datastorage',
    data: {
      name: `monitors-${CLIENT_ID || ''}`,
      description: 'Pysäkkinäytöt',
      ownerId: id,
      adminAccess: [CLIENT_ID],
      readAccess: [CLIENT_ID, id],
      writeAccess: [CLIENT_ID, id],
    },
  };
  try {
    const response = await makeOpenIdRequest(options, user);
    return response.data.id;
  } catch (e) {
    throw e;
  }
};

const getDataStorage = async user => {
  const id = user?.data.sub;
  const options = {
    method: 'GET',
    endpoint: '/api/rest/v1/datastorage',
    params: {
      dsfilter: `ownerId eq "${id}" and name eq "monitors-${CLIENT_ID || ''}"`,
    },
  };
  try {
    const response = await makeOpenIdRequest(options, user);
    const dataStorage = response.data.resources[0];
    if (dataStorage) {
      return dataStorage;
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};
