'use strict';

const Handlebars = require('handlebars');

Handlebars.registerHelper('dropDateYear', function (date) {
  return date.substring(0, 6);
});

module.exports = Handlebars;
