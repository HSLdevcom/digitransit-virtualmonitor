import cosmosClient from '@azure/cosmos';
import config from './config.js';

const { CosmosClient } = cosmosClient;

const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

async function getMonitor(hash) {
  try {
    const querySpec = {
      query: 'SELECT * from c WHERE c.contenthash = @hash',
      parameters: [
        {
          name: '@hash',
          value: hash,
        },
      ],
    };
    // read all items in the Items container
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    return items;
  } catch (e) {
    console.log('ERROR', e);
    return null;
  }
}

const monitorService = {
  get: async function get(req, res) {
    try {
      const contentHash = req.params.id;
      const items = await getMonitor(contentHash);
      if (items == null || !items.length) {
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
        query: 'SELECT * from c',
      };
      // read all items in the Items container
      const { resources: items } = await cont.items.query(querySpec).fetchAll();
      const monitors = [];
      const contenthashes = [];
      items.forEach(item => {
        monitors.push(item);
        contenthashes.push(item.monitorContenthash);
      });
      if (items == null || !items.length) {
        res.json({});
      } else {
        const queryS = {
          query:
            'SELECT * from c WHERE ARRAY_CONTAINS (@hashes, c.contenthash)',
          parameters: [
            {
              name: '@hashes',
              value: contenthashes,
            },
          ],
        };

        const { resources: userMonitors } = await container.items
          .query(queryS)
          .fetchAll();
        if (userMonitors == null || !userMonitors.length) {
          res.json({});
        } else {
          userMonitors.forEach(mon => {
            const monitor = monitors.find(
              m => m.monitorContenthash === mon.contenthash,
            );
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
  getMonitorsForUser: async function get(req, res, ids) {
    try {
      const cont = database.container('staticMonitors');
      const urls = ids;
      // query to return all items
      if (urls.length) {
        const querySpec = {
          query: 'SELECT * from c WHERE ARRAY_CONTAINS(@urls, c.url)',
          parameters: [
            {
              name: '@urls',
              value: urls,
            },
          ],
        };
        // read all items in the Items container
        const { resources: items } = await cont.items
          .query(querySpec)
          .fetchAll();
        res.json(items);
      } else {
        res.json([]);
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
  create: async function create(req, res) {
    console.log('creating monitor');
    console.log(req.body);
    try {
      await Promise.resolve(container.items.create(req.body));
      res.send('OK');
    } catch (e) {
      if (e.code !== 409) {
        console.log(e);
      }
      res.send(e);
    }
  },
  getStatic: async function getStaticMonitor(req, res) {
    console.log('url:', req.params.id);
    const container = database.container('staticMonitors');
    const url = req.params.id;
    const querySpec = {
      query: 'SELECT * from c WHERE c.url = @url',
      parameters: [
        {
          name: '@url',
          value: url,
        },
      ],
    };

    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    console.log('items', items);
    if (items.length) {
      res.json(items[0]);
    } else {
      res.json({});
    }
  },
  createStatic: async function createStaticMonitor(req, res) {
    console.log('creating static');
    console.log(req.body);
    try {
      const container = database.container('staticMonitors');
      await Promise.resolve(container.items.create(req.body));
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
      console.log('updating monitor:', req.body);
      const { resource: updatedItem } = await container
        .item(req.body.id, req.body.url)
        .replace(req.body);
      console.log('updated:', updatedItem);
      res.json(updatedItem);
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
