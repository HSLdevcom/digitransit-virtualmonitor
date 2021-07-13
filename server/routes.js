const express = require('express');
const { getTranslations3 } = require('gtfs');
const router = express.Router();

const monitorService = require('./monitorService');

router.get('/monitors', (req, res) => {
  monitorService.getAll(req, res);
});

router.get('/monitor/:id', (req, res) => {
  monitorService.get(req, res);
});

router.put('/monitor', (req, res) => {
  monitorService.create(req, res);
});

router.get('/translations/:recordIds', (req, res) => {
  const ids = req.params.recordIds.split(',');
  getTranslations3({record_id: ids}).then(t => {
    res.json(t);
  })
});

module.exports = router;