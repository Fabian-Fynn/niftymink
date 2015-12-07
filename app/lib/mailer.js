'use strict';

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var secrets = require('../../config/secrets');

// Create a SMTP transporter object
var options = secrets.sendgrid_options;

var mailer = nodemailer.createTransport(sgTransport(options));

function send_mail(email, callback) {
  mailer.sendMail(email, function(err, res) {
    if (err) {
      callback(err);
    }
    callback(null, res);
  });
};

exports.send_confirmation_mail = function(recipient, callback) {
  var email = {
    to: recipient,
    from: 'roger@tacos.com',
    subject: 'Hi there',
    text: 'Awesome sauce',
    html: '<b>Awesome sauce</b>'
  };

  send_mail(email, callback);
};
