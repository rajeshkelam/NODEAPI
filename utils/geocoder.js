const NodeGeoCoder = require('node-geocoder');
const dotenv = require('dotenv');

//load config via config.env
dotenv.config({ path: '../config/config.env' });

const options= {
    provider : 'mapquest',
    httpAdapter : 'https',
    apiKey : 'NYtAzOePTefUY0U0QSdOJ97bQf0rQqrv',
    formatter : null
}

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;