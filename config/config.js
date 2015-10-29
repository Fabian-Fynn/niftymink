'use strict';


//exports.prod_db = 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/niftymink'

var development = {
  Port : 4000,
  socketHost : '127.0.0.1',
  db: 'mongodb://localhost/niftymink-dev',
  env: 'DEVELOPMENT'
};

var staging = {
  Port : 4100,
  socketHost : '127.0.0.1',
  db: 'mongodb://localhost/niftymink-staging',
  env: 'STAGING'
}

var production = {
  Port : 4000,
  socketHost : '127.0.0.1',
  db: 'mongodb://localhost/niftymink-prod',
  env: 'PRODUCTION'
}

if(global.process.env.NODE_ENV === 'production') {
  var config = production;
} else if(global.process.env.NODE_ENV ==='development') {
  var config = development;
} else {
  var config = staging;
}

module.exports = config;
