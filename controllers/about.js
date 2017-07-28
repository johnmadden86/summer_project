'use strict';

const logger = require('../utils/logger');

const about = {
  index(request, response) {
    logger.info(`rendering about`);
    const viewData = {
      title: 'About',
    };
    response.render('about', viewData);
  },
};

module.exports = about;
