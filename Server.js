const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
//import route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
// import middleware logger
// const logger = require('./middleware/Logger');

// import morgan 3rd party middlware
const morgan = require('morgan');
//load config via config.env
dotenv.config({ path: './config/config.env' });

//connect Mongo DB
connectDB();

const app = express();
//Body parser
app.use(express.json())

// app.use(logger);
// dev looging middleware via morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use('/api/v1/courses', courses);


//middleware logger
app.use(errorHandler);


const PORT = process.config.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    server.close(() => process.exit(1))
});