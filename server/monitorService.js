import cosmosClient from '@azure/cosmos';
const CosmosClient = cosmosClient.CosmosClient;
//const config = require("./config");
import config from './config.js'

const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

const monitorService = {
  getAll: async function getAll(req, res) {
    try {
      // <QueryItems>
      console.log(`Querying container: monitors`);

      // query to return all items
      const querySpec = {
        query: "SELECT * from c"
      };
      // read all items in the Items container
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();

      items.forEach(item => {
        console.log(`${item.contenthash}`);
      });
      res.json(items);
    } catch (e) {
      console.log(e)
      res.status(500).send(e);
    }
  },
  get: async function get(req, res) {
    try {
      // <QueryItems>
      console.log(`Querying a monitor`);
      console.log(req.params.id);
      // query to return all items
      const querySpec = {
        query: "SELECT * from c WHERE c.contenthash = @hash",
        parameters: [
          {
            name: "@hash",
            value:  req.params.id,    
          }
        ],
      };
      // read all items in the Items container
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();

      items.forEach(item => {
        console.log(`${item.contenthash}`);
      });
      if (!items.length) {
        res.json({});
      } else {
        res.json(items[0]);
      }
    } catch (e) {
      console.log(e)
      res.status(500).send(e);
    }
  },
  getMonitorsForUser: async function get(req, res) {
    try {
      const cont = database.container('staticMonitors');
      // <QueryItems>
      console.log(`Querying a static monitor`);
      console.log(req.params.id);
      // query to return all items
      const querySpec = {
        query: "SELECT c.name, c.monitorContenthash from c WHERE c.url = @id",
        parameters: [
          {
            name: "@id",
            value:  req.params.id,
          }
        ],
      };
      // read all items in the Items container
      const { resources: items } = await cont.items
          .query(querySpec)
          .fetchAll();
      let monitors;
      items.forEach(item => {
        console.log('item', item)
        monitors = item;
      });
      if (!items.length) {
        res.json({});
      } else {
        const queryS = {
          query: "SELECT * from c WHERE ARRAY_CONTAINS (@hashes, c.contenthash)",
              parameters: [
            {
              name: "@hashes",
              value:  [monitors.monitorContenthash]
            }
          ],
        };
        const { resources: items } = await container.items
            .query(queryS)
            .fetchAll();
        if (!items.length) {
          res.json({});
        } else {
          let userMonitors = items;
           userMonitors.forEach(mon => {
            mon.name = monitors.name;
          });
          res.json(userMonitors);
        }
      }
    } catch (e) {
      console.log(e)
      res.status(500).send(e);
    }
  },
  create: async function create(req, res) {
    try {
      // <QueryItems>
      console.log(`Adding a monitor`);

      console.log(req.body);
      await Promise.resolve(container.items.create(req.body))
      res.status(200).send('OK');
    } catch (e) {
      console.log(e)
      res.status(500).send(e);
    }
  }
}

export default monitorService;
