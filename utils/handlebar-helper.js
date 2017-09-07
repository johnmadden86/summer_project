'use strict';

const Handlebars = require('handlebars');

Handlebars.registerHelper('dropDateYear', function (date) {
  return date.substring(0, 6);
});

Handlebars.registerHelper('dateInPast', function (date) {
  const today = new Date();
  return new Date(date) < today;
});

module.exports = Handlebars;
