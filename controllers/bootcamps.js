const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

//@ desc     Get all bootcamps in radius
//@ route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@ access   public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    //get lat/lang from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radius
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

});

//@ desc     Get all bootcamps
//@ route    GET /api/v1/bootcamps
//@ access   public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    //copy req.query
    const reqQuery = { ...req.query };
    // Fields to be exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // create query string
    let queryStr = JSON.stringify(reqQuery);
    console.log("queryStr : " + queryStr);

    //Create operators  ($gt,$gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    console.log("queryStr : " + JSON.parse(queryStr));
    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
    // select fields 
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // sort fields 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }
    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    //executing query  
    const bootcamp = await query;
    res.status(200).json({
        success: true,
        count: bootcamp.length,
        pagination,
        data: bootcamp
    })
});

//@ desc     Get single bootcamps
//@ route    GET /api/v1/bootcamps/:id
//@ access   public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: bootcamp
    })
    res.status(200).json({ success: true, msg: `Display boot camp ${req.params.id}` })
});

//@ desc     create new bootcamps
//@ route    POST /api/v1/bootcamps
//@ access   private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    })
});

//@ desc     update bootcamp
//@ route    PUT /api/v1/bootcamps/:id
//@ access   private

exports.updateBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, {
        mew: true,
        runValidators: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Boot camp update failed for ${req.params.id} ,400`));
    }

    res.status(200).json({ success: true, data: bootcamp });
});

//@ desc     delete bootcamp
//@ route    DELETE /api/v1/bootcamps/:id
//@ access   private

exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Boot camp delete failed for ${req.params.id} ,404`));
    }
    bootcamp.remove();
    res.status(200).json({ success: true, data: {} });
});