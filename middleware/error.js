// const ErrorResponse = require('../utils/errorResponse');
// const errorHandler = (err,req,res,next) =>{

//     // error log at console
//     console.log(err);
//     let error = {...err};
//     error.message = err.message;

//     // Mangoose bad Objectid
//     if(err.name === 'CastError'){
//         const  message = `Boot camp not ofund with the id of ${err.value}`;
//         error = new ErrorResponse(message,404);
//     }

//     //Mangoose duplicate key error
//     if(err.code = 11000){
//         const message = 'Duplicate field value entred';
//         error = new ErrorResponse(message,400);
//     }

//     //mangoose validation errors
//     if(err.name = 'validationError' ){
//         const message = Object.values(err.errors).map(val => val.message);
//         error = new ErrorResponse(message,400);
//     }

//     res.status(error.statusCode || 500).json({
//         success : false,
//         error : error.message || 'Server Error'
//     });
// };

// module.exports = errorHandler;

const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
