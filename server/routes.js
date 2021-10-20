import express from 'express';
import { getTranslations, getTranslations3 } from 'gtfs';

import monitorService from './monitorService.js';

const router = express.Router();

router.get('/monitor/:id', (req, res) => {
  monitorService.get(req, res);
});

router.get('/usermonitors/:id', (req, res) => {
  monitorService.getMonitorsForUser(req, res);
});

router.get('/usermonitors', (req, res) => {
  monitorService.getAllMonitorsForUser(req, res);
});

router.put('/monitor', (req, res) => {
  monitorService.create(req, res);
});

router.get('/translations/:recordIds', (req, res) => {
  const ids = req.params.recordIds.split(',');
  getTranslations({ trans_id: ids }).then(t => {
    res.json(t);
  });
});

router.put('/staticmonitor', (req, res) => {
  monitorService.createStatic(req, res);
});

router.post('/staticmonitor', (req, res) => {
  monitorService.updateStatic(req, res);
});

router.delete('/staticmonitor', (req, res) => {
  monitorService.deleteStatic(req, res);
});

export default router;
