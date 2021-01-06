const express= require('express');
const dotenv = require('dotenv');

//load config via config.env
dotenv.config({ path : './config/config.env' });

const app = express();

const  PORT = process.config.PORT || 5000;

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

 