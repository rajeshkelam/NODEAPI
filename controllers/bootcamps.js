const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async'); 
const geocoder = require('../utils/geocoder');

//@ desc     Get all bootcamps
//@ route    GET /api/v1/bootcamps
//@ access   public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
        const bootcamp = await Bootcamp.find();
        res.status(200).json({
            success : true,
            data : bootcamp
        })  
});


//@ desc     Get single bootcamps
//@ route    GET /api/v1/bootcamps/:id
//@ access   public

exports.getBootcamp = asyncHandler(async(req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        res.status(200).json({
            success : true,
            data : bootcamp
        })
    res.status(200).json({ success: true, msg: `Display boot camp ${req.params.id}` })
});

//@ desc     create new bootcamps
//@ route    POST /api/v1/bootcamps
//@ access   private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success : true,
            data : bootcamp
        })
  });

//@ desc     update bootcamp
//@ route    PUT /api/v1/bootcamps/:id
//@ access   private

exports.updateBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await  Bootcamp.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{
            mew : true,
            runValidators : true
        });
         if(!bootcamp){
             return  next(new ErrorResponse(`Boot camp update failed for ${req.params.id} ,400`));
         }
     
         res.status(200).json({success: true,data : bootcamp});
  });

//@ desc     delete bootcamp
//@ route    DELETE /api/v1/bootcamps/:id
//@ access   private

exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
        const bootcamp = await  Bootcamp.findByIdAndDelete(req.params.id);
         if(!bootcamp){
             return  next(new ErrorResponse(`Boot camp delete failed for ${req.params.id} ,404`));
         }
        res.status(200).json({success: true,data : {}});
});