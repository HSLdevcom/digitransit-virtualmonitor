import monitorService from './monitorService.js';
import axios from 'axios';

const CLIENT_ID = process.env.MANAGEMENT_API_ID;
const CLIENT_SECRET = process.env.MANAGEMENT_API_SECRET;

export const isUserOwnedMonitor = async (req, res) => {
  const userMonitors = await getDataStorageMonitors(req, res)
  if (userMonitors.includes(req.params.id)) {
    res.status(200).send({msg: 'OK'});
  } else {
    res.status(401).send({msg: 'Unauthorized'});
  }
}

export const updateStaticMonitor = async (req, res) => {
  const userMonitors = await getDataStorageMonitors(req, res)
  if (userMonitors.includes(req.body.url)) {
    monitorService.updateStatic(req, res);
  } else {
    res.status(401).send("Unauthorized");
  }
}

export const getMonitors = async (req, res) => {
  try {
    const monitors = await getDataStorageMonitors(req, res);
    monitorService.getMonitorsForUser(req, res, monitors);
  } catch {
    console.log("error")
  }
}

const getDataStorageMonitors = async (req, res) => {
  try {
    let dataStorage
    dataStorage = await getDataStorage(req?.user?.data.sub);
    if (dataStorage) {
      console.log("found data storage: ", dataStorage)
      const options = {
        endpoint: `/api/rest/v1/datastorage/${dataStorage.id}/data`,
      };
      const response = await makeHslIdRequest(options);
      return Object.keys(response.data).map(key => key);
    } else {
      console.log("no data storage found, user doesn't have any monitors")
      return [];
    }
  } catch {
    console.log("Error fetching monitors")
  }
}

export const deleteMonitor = async (req, res) => {
  try {
    const userId = req?.user?.data.sub;
    let dataS = await getDataStorage(userId);
    if (dataS) {
      const options = {
        endpoint: `/api/rest/v1/datastorage/${dataS.id}/data`,
      };
      const response = await makeHslIdRequest(options);
      const monitors = Object.keys(response.data).map(key => key);
      if (monitors.includes(req.body.url)) {
        const response = await deleteMonitorHSL(dataS.id, req.body.url)
        monitorService.deleteStatic(req,res);
      } else {
        console.log("not authorised")
      }
    }
  } catch {
    console.log("error deleting monitor")
  }
}

export const createMonitor = async (req, res) => {
  try {
    const userId = req?.user?.data.sub;
    //validate(updateSchema, schema);
    const dataStorage = {
      id: '',
    };
    //console.log('searching existing datastorage');
    let dataS = await getDataStorage(userId);//.then(res => {
    if (dataS) {
      dataStorage.id = dataS.id;
      console.log("existing data storage found");
    } else {
      console.log("no data storage, creating one")
      dataS = await createDataStorage(userId);
      dataStorage.id = dataS;
    }
    console.log("adding monitor to data storage: ", dataStorage.id)
    const res = await updateMonitors(dataStorage.id, req.body);
  } catch (e) {
    console.log("Error creating monitor", e)
  }
}

const makeHslIdRequest = async (
  options,
) => {
  try {
    const hslIdUrl = 'https://hslid-uat.cinfra.fi';
    const credentials = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
    options.url = `${hslIdUrl}${options.endpoint}`;
    options.headers = {
      Authorization: credentials,
      'Content-Type': 'application/json',
    };
    const response = axios(options);
    return response;
  } catch (err) {
    console.log("error making hslid request");
  }
  
};
const deleteMonitorHSL = async (
  dataStorageId,
  monitor,
) => {
  try {
    console.log("Deleting  MONITOR from", dataStorageId)
    const options = {
      method: 'DELETE',
      endpoint: `/api/rest/v1/datastorage/${dataStorageId}/data/${monitor}`,
    };
    const response = await makeHslIdRequest(options);
    return response;
  } catch (err) {
    console.log("Error updating data storage", err)
  }
};

const updateMonitors = async (
  dataStorageId,
  monitor,
) => {
  try {
    console.log("UPDATING MONITOR TO", dataStorageId)
    const options = {
      method: 'PUT',
      endpoint: `/api/rest/v1/datastorage/${dataStorageId}/data/${monitor.url}`,
      data: {'value': monitor.monitorContenthash},
    };
    const response = await makeHslIdRequest(options);
    return response;
  } catch (err) {
    console.log("Error updating data storage", err)
  }
};

const createDataStorage = async (id) => {
  const options = {
    method: 'POST',
    endpoint: `/api/rest/v1/datastorage`,
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
    const response = await makeHslIdRequest(options);
    console.log("created, res:", response.data)
    return response.data.id;
  } catch (e) {
    console.log("error creating data storage", e)
  }
}

const getDataStorage = async (id) => {

  const options = {
    method: 'GET',
    endpoint: '/api/rest/v1/datastorage',
    params: {
      dsfilter: `ownerId eq "${id}" and name eq "monitors-${
        CLIENT_ID || ''
      }"`,
    },
  };
  try {
    const response = await makeHslIdRequest(options);
    const dataStorage = response.data.resources[0];
    if (dataStorage) {
      return dataStorage;
    } else {
      throw "Datastorage not found"
    }
  } catch (error) {
    console.log('error, DataStorage not found');
  }
};