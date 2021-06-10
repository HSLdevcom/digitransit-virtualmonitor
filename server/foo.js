const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");

const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

const foo = {
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
}
}

module.exports = foo;
