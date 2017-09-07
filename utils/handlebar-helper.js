'use strict';

const Handlebars = require('handlebars');
const logger = require('./logger');

Handlebars.registerHelper('dropDateYear', function (date) {
  return date.substring(0, 6);
});

Handlebars.registerHelper('dateInPast', function (date) {
  const today = new Date();
  return new Date(date) < today;
});

Handlebars.registerHelper('altTimeFormat', function (time) {
  const hours = time.substring(1, 2);
  const minutes = time.substring(3, 5);
  if (hours === '0') {
    return minutes + ' mins';
  } else if (minutes === '00') {
    return hours + ' hour';
  } else {
    return hours + ' h ' + minutes + ' mins';
  }
});

module.exports = Handlebars;
