'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const memberStore = require('../models/member-store');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentMember(request);
    const viewData = {
      title: 'Dashboard',
      member: loggedInUser,
    };
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessment = request.body;
    assessment.assessmentId = uuid();
    memberStore.addAssessment(loggedInUser, assessment);
    logger.info(`Adding new assessment for ${loggedInUser.fullName}`);
    response.redirect('/dashboard');
  },

  deleteAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessmentId = request.params.assessmentId;
    logger.debug(`Deleting Assessment ${assessmentId} for ${loggedInUser.fullName}`);
    memberStore.removeAssessment(loggedInUser.id, assessmentId);
    response.redirect('/dashboard');
  },
};

module.exports = dashboard;
