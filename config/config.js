'use strict';

exports.dev_db = 'mongodb://localhost/niftymink-dev';
exports.prod_db = 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/niftymink'
