import cosmosClient from '@azure/cosmos';
// eslint-disable-next-line import/extensions
import config from './config.js';

const { CosmosClient } = cosmosClient;

const {
 endpoint, key, databaseId, containerId 
} = config;

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
  getAll: async function getAll(req, res) {
    try {
      // <QueryItems>
      console.log('Querying container: monitors');

      // query to return all items
      const querySpec = {
        query: 'SELECT * from c',
      };
      // read all items in the Items container
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();

      items.forEach((item) => {
        console.log(`${item.contenthash}`);
      });
      res.json(items);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
  get: async function get(req, res) {
    try {
      // <QueryItems>
      console.log('Querying a monitor');
      // query to return all items
      const items = await getMonitor(req.params.id);
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
  getStaticMonitor: async function get(req, res) {
    try {
      let contentHash;
      const cont = database.container('staticMonitors');
      // <QueryItems>
      console.log('Querying a static monitor');
      const url = req.params.id;
      // query to return all items
      const querySpec = {
        query: 'SELECT c.monitorContenthash from c WHERE c.url = @url',
        parameters: [
          {
            name: '@url',
            value: url,
          },
        ],
      };
      // read all items in the Items container
      const { resources: items } = await cont.items.query(querySpec).fetchAll();
      contentHash = items[0].monitorContenthash;
      if (!items) {
        res.json({});
      } else {
        const items = await getMonitor(contentHash);
        if (!items.length) {
          res.json({});
        } else {
          res.json(items[0]);
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
      // <QueryItems>
      console.log('Querying a static monitor');
      const urls = req.params.id.split(',');
      // query to return all items
      const querySpec = {
        query:
          'SELECT c.name, c.monitorContenthash from c WHERE ARRAY_CONTAINS(@urls, c.url)',
        parameters: [
          {
            name: '@urls',
            value: urls,
          },
        ],
      };
      // read all items in the Items container
      const { resources: items } = await cont.items.query(querySpec).fetchAll();
      const monitors = [];
      const contenthashes = [];
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
              name: '@hashes',
              value: contenthashes,
            },
          ],
        };
        const { resources: userMonitors } = await container.items
          .query(queryS)
          .fetchAll();
        if (!userMonitors.length) {
          res.json({});
        } else {

          userMonitors.forEach(mon => {
            const monitor = monitors.find(
              m => m.monitorContenthash === mon.contenthash,
            );
            mon.name = monitor.name;
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
      // <QueryItems>
      console.log('Adding a monitor');

      console.log(req.body);
      await Promise.resolve(container.items.create(req.body));
      res.status(200).send('OK');
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
};

export default monitorService;
