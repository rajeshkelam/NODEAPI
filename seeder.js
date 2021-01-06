const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require("path");

//load env variables
dotenv.config({path :'./config/config.env'});

//load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

//connect to DB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false, 
    useUnifiedTopology: true
});

// Read JSON file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));

//Import into DB
const importData = async()=>{
    try{
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log('Data Imporrted successfully!');
    process.exit();
    }catch(err){
        console.error(err);
    }
}

// deleted imported data

const deleteData = async()=>{
    try{
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('Data destroyed !');
    process.exit();
    }catch(err){
        console.error(err);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}