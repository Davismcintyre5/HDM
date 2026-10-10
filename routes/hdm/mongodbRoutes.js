const router = require('express').Router();
const mongodbController = require('../../controllers/hdm/mongodbController');

router.get('/stats', mongodbController.stats);
router.get('/databases', mongodbController.databases);
router.get('/database/:db', mongodbController.collections);
router.get('/database/:db/:col', mongodbController.collection);
router.get('/database/:db/:col/query', mongodbController.query);
router.delete('/database/:db/:col', mongodbController.dropCollection);
router.delete('/database/:db', mongodbController.dropDatabase);

module.exports = router;