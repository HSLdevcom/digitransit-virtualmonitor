const express = require('express');
const router = express.Router();

const monitorService = require('./foo');

router.get('/monitors', (req, res) => {
  console.log(monitorService, req, res)
  monitorService.getAll(req, res);
});

router.put('/monitor', (req, res) => {
  monitorService.create(req, res);
});

// router.post('/hero', (req, res) => {
//   heroesService.update(req, res);
// });

router.delete('/hero/:id', (req, res) => {
  monitorService.destroy(req, res);
});

module.exports = router;