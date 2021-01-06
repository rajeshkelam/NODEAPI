const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamps,
    deleteBootcamps,
    getBootcampsInRadius
} = require('../controllers/bootcamps');

//include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router.
    route('/:id')
    .get(getBootcamp)
    .put(updateBootcamps)
    .delete(deleteBootcamps);

module.exports = router;