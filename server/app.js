// // @ts-check
// //  <ImportConfiguration>
// const CosmosClient = require("@azure/cosmos").CosmosClient;
// const config = require("./config");
// const dbContext = require("./data/databaseContext");
// //  </ImportConfiguration>

// //  <DefineNewItem>
// const newItem = {
//     contenthash: "abc1231",
//     monitors: [
//         {
//             id: 1,
//             title: "Foo",
//             stops: [
//                 {
//                     code: "H0132",
//                     desc: "Mannerheimintie",
//                     gtfsId: "HSL:1180444",
//                     hiddenRoutes: [
//                         {
//                             __typename: "Route",
//                             shortName: "8H",
//                             gtfsId: "HSL:1008H"
//                         }
//                     ],
//                     name: "Kuusitie",
//                     platformCode: null
//                 }
//             ],
//             layout: 2,
//             time: 5
//         },
//         {
//             id: 2,
//             title: "Bar",
//             stops: [
//                 {
//                     code: "H1501",
//                     desc: "Neulastie",
//                     gtfsId: "HSL:1333105",
//                     hiddenRoutes: [
//                         {
//                             __typename: "Route",
//                             shortName: "39N",
//                             gtfsId: "HSL:1039N"
//                         }
//                     ],
//                     name: "Neulastie",
//                     platformCode: null
//                 },
//                 {
//                     __typename: "Stop",
//                     name: "Hesperian puisto",
//                     code: "H1909",
//                     desc: "Mannerheimintie",
//                     gtfsId: "HSL:1130206",
//                     platformCode: null,
//                     hiddenRoutes: []
//                 }
//             ],
//             layout: 2,
//             time: 5
//         }
//     ]
// };
// //  </DefineNewItem>
// const { endpoint, key, databaseId, containerId } = config;

// const client = new CosmosClient({ endpoint, key });

// const database = client.database(databaseId);
// const container = database.container(containerId);

// async function getAll(req, res) {
//   try {
//     // <QueryItems>
//     console.log(`Querying container: monitors`);

//     // query to return all items
//     const querySpec = {
//       query: "SELECT * from c"
//     };
    
//     // read all items in the Items container
//     const { resources: items } = await container.items
//       .query(querySpec)
//       .fetchAll();

//     items.forEach(item => {
//       console.log(`${item.contenthash}`);
//     });
//     res.json(items);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// }
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../build')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/api', index);
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });
// app.get('*', (req, res) => {
//   res.sendFile("build/index.html", { root: root });
// });
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
  //res.end()
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  //err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
