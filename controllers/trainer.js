'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');

const trainer = {
  index(request, response) {
    logger.info('trainer dashboard rendering');
    const loggedInUser = accounts.getCurrentTrainer(request);
    const viewData = {
      title: 'Trainer Dashboard',
      user: loggedInUser,
    };
    response.render('trainer-dashboard', viewData);
  },
};
