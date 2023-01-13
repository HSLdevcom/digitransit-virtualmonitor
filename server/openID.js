import axios from 'axios';
import monitorService from './monitorService.js';

const CLIENT_ID_LIST = JSON.parse(process.env.MANAGEMENT_API_ID);
const CLIENT_SECRET_LIST = JSON.parse(process.env.MANAGEMENT_API_SECRET);
const OPEN_ID_URL_LIST = JSON.parse(process.env.OIDCHOST);

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
    const apiClient = getClientAndUserInformation(req?.user);
    let dataStorage;
    dataStorage = await getDataStorage(apiClient);
    if (dataStorage) {
      const options = {
        endpoint: `/api/rest/v1/datastorage/${dataStorage.id}/data`,
      };
      const response = await makeOpenIdRequest(options, apiClient);
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
    const apiClient = getClientAndUserInformation(req?.user);
    const dataS = await getDataStorage(apiClient);
    if (dataS) {
      const options = {
        endpoint: `/api/rest/v1/datastorage/${dataS.id}/data`,
      };
      const response = await makeOpenIdRequest(options, apiClient);
      const monitors = Object.keys(response.data).map(key => key);
      if (monitors.includes(req.body.url)) {
        const response = await deleteMonitorOpenId(dataS.id, req?.body?.url, apiClient);
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
    const dataStorage = {
      id: '',
    };
    const apiClient = getClientAndUserInformation(req?.user);
    let dataS = await getDataStorage(apiClient);
    if (dataS) {
      dataStorage.id = dataS.id;
      console.log('existing data storage found');
    } else {
      console.log('no data storage, creating one');
      dataS = await createDataStorage(apiClient);
      dataStorage.id = dataS;
    }
    const res = await updateMonitors(dataStorage.id, req?.body, apiClient, next);
  } catch (e) {
    next(e);
  }
};

const makeOpenIdRequest = async (options, apiClient) => {
  try {
    const credentials = `Basic ${Buffer.from(
      `${apiClient.id}:${apiClient.secret}`,
    ).toString('base64')}`;
    options.url = `${apiClient.openIdUrl}${options.endpoint}`;
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
const deleteMonitorOpenId = async (dataStorageId, monitor, apiClient) => {
  try {
    const options = {
      method: 'DELETE',
      endpoint: `/api/rest/v1/datastorage/${dataStorageId}/data/${monitor}`,
    };
    const response = await makeOpenIdRequest(options, apiClient);
    return response;
  } catch (err) {
    throw err;
  }
};

const updateMonitors = async (dataStorageId, monitor, apiClient) => {
  try {
    const options = {
      method: 'PUT',
      endpoint: `/api/rest/v1/datastorage/${dataStorageId}/data/${monitor.url}`,
      data: { value: monitor.monitorContenthash },
    };
    const response = await makeOpenIdRequest(options, apiClient);
    return response;
  } catch (err) {
    throw err;
  }
};

const createDataStorage = async (apiClient) => {
  const userId = apiClient.userId;
  const options = {
    method: 'POST',
    endpoint: '/api/rest/v1/datastorage',
    data: {
      name: `monitors-${apiClient.id || ''}`,
      description: 'Pysäkkinäytöt',
      ownerId: userId,
      adminAccess: [apiClient.id],
      readAccess: [apiClient.id, userId],
      writeAccess: [apiClient.id, userId],
    },
  };
  try {
    const response = await makeOpenIdRequest(options, user);
    return response.data.id;
  } catch (e) {
    throw e;
  }
};

const getDataStorage = async (apiClient) => {
  const options = {
    method: 'GET',
    endpoint: '/api/rest/v1/datastorage',
    params: {
      dsfilter: `ownerId eq "${apiClient.userId}" and name eq "monitors-${apiClient.id || ''}"`,
    },
  };
  try {
    const response = await makeOpenIdRequest(options, apiClient);
    const dataStorage = response.data.resources[0];
    if (dataStorage) {
      return dataStorage;
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};

function getClientAndUserInformation(user) {
  const HSL_CLIENT = {
    openIdUrl: OPEN_ID_URL_LIST.hsl,
    id: CLIENT_ID_LIST.hsl,
    secret: CLIENT_SECRET_LIST.hsl
  }

  const WALTTI_CLIENT = {
    openIdUrl: OPEN_ID_URL_LIST.waltti,
    id: CLIENT_ID_LIST.waltti,
    secret: CLIENT_SECRET_LIST.waltti
  }

  const userData = JSON.stringify(user?.data);
  if (userData.indexOf('hsl') !== -1) {
    return {
      ...HSL_CLIENT,
      userId: user?.data?.sub
    };
  } else if (userData.indexOf('waltti') !== -1) {
    return {
      ...WALTTI_CLIENT,
      userId: user?.data?.sub
    }
  }
  
  return {
    openIdUrl: '',
    id: '',
    secret: '',
    userId: user?.data?.sub
  };
}
