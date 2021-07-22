const express = require('express');
const router = express.Router();

const monitorService = require('./monitorService');

router.get('/monitors', (req, res) => {
  monitorService.getAll(req, res);
});

router.get('/monitor/:id', (req, res) => {
  monitorService.get(req, res);
});

router.get('/usermonitors/:id',(req, res) => {
  monitorService.getMonitorsForUser(req, res);
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