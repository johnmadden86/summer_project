'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const memberStore = require('../models/member-store');
const analytics = require('../utils/analytics');
const staticMethods = require('../utils/static-methods');
const classStore = require('../models/class-store');
const uuid = require('uuid');

const member = {

  index(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    let openGoals = false;
    loggedInUser.goals.forEach(
        function (goal) {
          if (goal.status === 'Open' || goal.status === 'Awaiting Processing') {
            openGoals = true;
          }
        }
    );
    const viewData = {
      title: 'Dashboard',
      member: loggedInUser,
      openGoals: openGoals,
    };
    logger.debug(viewData);
    logger.info(`dashboard rendering for ${loggedInUser.name.full}`);
    response.render('dashboard', viewData);
  },

};

module.exports = member;
