import cosmosClient from '@azure/cosmos';
import config from './config.js';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

const CosmosClient = cosmosClient.CosmosClient;

const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

function uuidValidateV5(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 5;
}

async function getMonitor(hash) {
  try {
    const querySpec = {
      query: "SELECT * from c WHERE c.contenthash = @hash",
      parameters: [
        {
          name: "@hash",
          value: hash,
        },
      ],
    };
    // read all items in the Items container
    const {resources: items} = await container.items.query(querySpec).fetchAll();
    return items;
  } catch (e) {
    console.log('ERROR', e);
    return null;
  }
}

const monitorService = {
  get: async function get(req, res) {
    try {
      let contentHash = req.params.id;
      const isValidUuid = uuidValidateV5(req.params.id);
      if (isValidUuid) {
        const container = database.container('staticMonitors');
        const url = req.params.id;
        const querySpec = {
          query: "SELECT c.monitorContenthash from c WHERE c.url = @url",
          parameters: [
            {
              name: "@url",
              value: url,
            },
          ],
        };
        const { resources: items } = await container.items.query(querySpec).fetchAll();
        contentHash = items[0].monitorContenthash;
      }
      const items = await getMonitor(contentHash);
      if (!items.length) {
        res.json({});
      } else {
        res.json(items[0]);
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
  getAllMonitorsForUser: async function getAll(req, res) {
    try {
      const cont = database.container('staticMonitors');
      // query to return all items
      const querySpec = {
        query: "SELECT * from c"
      };
      // read all items in the Items container
      const { resources: items } = await cont.items
          .query(querySpec)
          .fetchAll();
      let monitors = [];
      let contenthashes = [];
      items.forEach(item => {
        monitors.push(item);
        contenthashes.push(item.monitorContenthash);
      });
      if (!items.length) {
        res.json({});
      } else {
        const queryS = {
          query:
            'SELECT * from c WHERE ARRAY_CONTAINS (@hashes, c.contenthash)',
          parameters: [
            {
              name: "@hashes",
              value: contenthashes
            }
          ],
        };
        const { resources: items } = await container.items.query(queryS).fetchAll();
        if (!items.length) {
          res.json({});
        } else {
          let userMonitors = items;
          userMonitors.forEach(mon => {
            const monitor = monitors.find(m => m.monitorContenthash ===  mon.contenthash);
            mon.name = monitor.name;
            mon.url = monitor.url;
          });
          res.json(userMonitors);
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
  getMonitorsForUser: async function get(req, res) {
    try {
      const cont = database.container('staticMonitors');
      const urls = req.params.id.split(',');
      // query to return all items
      const querySpec = {
        query:
          'SELECT c.name, c.monitorContenthash, c.url from c WHERE ARRAY_CONTAINS(@urls, c.url)',
        parameters: [
          {
            name: "@urls",
            value: urls,
          },
        ],
      };
      // read all items in the Items container
      const { resources: items } = await cont.items
          .query(querySpec)
          .fetchAll();
      let monitors = [];
      let contenthashes = [];
      items.forEach(item => {
        monitors.push(item);
        contenthashes.push(item.monitorContenthash);
      });
      if (!items.length) {
        res.json({});
      } else {
        const queryS = {
          query:
            'SELECT * from c WHERE ARRAY_CONTAINS (@hashes, c.contenthash)',
          parameters: [
            {
              name: "@hashes",
              value: contenthashes
            }
          ],
        };
        const { resources: items } = await container.items.query(queryS).fetchAll();
        if (!items.length) {
          res.json({});
        } else {
          let userMonitors = items;
          userMonitors.forEach(mon => {
            const monitor = monitors.find(m => m.monitorContenthash ===  mon.contenthash);
            mon.name = monitor.name;
            mon.url = monitor.url;
          });
          res.json(userMonitors);
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
  create: async function create(req, res) {
    try {
      await Promise.resolve(container.items.create(req.body))
      res.send('OK');
    } catch (e) {
      if (e.code !== 409) {
        console.log(e);
      }
      res.send(e);
    }
  },
  createStatic: async function createStaticMonitor(req, res) {
    try {
      const container = database.container('staticMonitors');
      await Promise.resolve(container.items.create(req.body))
      res.send('OK');
    } catch (e) {
      if (e.code !== 409) {
        console.log(e);
      }
      res.send(e);
    }
  },
  updateStatic: async function updateStaticMonitor(req, res) {
    try {
      const container = database.container('staticMonitors');
      const itemToUpdate = await container.item(req.body.id, req.body.url).read();
      if (!itemToUpdate) {
        res.json({});
      } else {
        const newData = {
          ...itemToUpdate.resource,
          id: req.body.hash,
          name: req.body.name,
          monitorContenthash: req.body.hash,
        }
        const { resource: updatedItem } = await container.item(req.body.id, req.body.url).replace(newData);
        res.json(updatedItem);
      }
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  },
  deleteStatic: async function deleteStaticMonitor(req, res) {
    try {
      const container = database.container('staticMonitors');
      const { body } = await container.item(req.body.id, req.body.url).delete();
      res.status(200).json(body);
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  },
};

export default monitorService;
