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
    throw e;
  }
}

const monitorService = {
  get: async function get(req, res, next) {
    try {
      const contentHash = req.params.id;
      const items = await getMonitor(contentHash);
      if (items == null || !items.length) {
        res.json({});
      } else {
        res.json(items[0]);
      }
    } catch (e) {
      next(e);
    }
  },
  getMonitorsForUser: async function get(req, res, next, ids) {
    try {
      const cont = database.container('staticMonitors');
      const urls = ids;
      const instanceName = req.params.instanceName;
      // query to return all items
      if (urls.length) {
        const querySpec = {
          query: 'SELECT * from c WHERE ARRAY_CONTAINS(@urls, c.url) AND (IS_DEFINED(c.instance) = false OR c.instance = @instance)',
          parameters: [
            {
              name: '@urls',
              value: urls,
            },
            {
              name: '@instance',
              value: req.params.instanceName,
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
      next(e);
    }
  },
  create: async function create(req, res, next) {
    try {
      await Promise.resolve(container.items.create(req.body));
      res.send('OK');
    } catch (e) {
      if (e.code === 409) {
        res.status(409).send('OK');
      } else {
        next(e);
      }
    }
  },
  getStatic: async function getStaticMonitor(req, res, next) {
    try {
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
      if (items.length) {
        res.json(items[0]);
      } else {
        res.json({});
      }
    } catch (err) {
      next(err);
    }
  },
  createStatic: async function createStaticMonitor(req, res, next) {
    try {
      const container = database.container('staticMonitors');
      await Promise.resolve(container.items.create(req.body));
      res.send('OK');
    } catch (e) {
      next(e);
    }
  },
  updateStatic: async function updateStaticMonitor(req, res) {
    try {
      const container = database.container('staticMonitors');
      const { resource: updatedItem } = await container
        .item(req.body.id, req.body.url)
        .replace(req.body);
      res.json(updatedItem);
    } catch (e) {
      throw e;
    }
  },
  deleteStatic: async function deleteStaticMonitor(req, res) {
    try {
      const container = database.container('staticMonitors');
      const { body } = await container.item(req.body.id, req.body.url).delete();
      res.status(200).json(body);
    } catch (e) {
      throw e;
    }
  },
};

export default monitorService;
