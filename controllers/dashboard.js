'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const assessments = require('../models/assessment-store');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentMember(request);
    const viewData = {
      title: 'Dashboard',
      assessments: assessments.getUserAssessments(loggedInUser.id),
    };
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessment = request.body;
    assessment.assessmentId = uuid();
    assessment.userId = loggedInUser.id;
    assessments.addAssessment(assessment);
    logger.info(`Adding new assessment for ${loggedInUser.fullName}`);
    response.redirect('/dashboard');
  },

};

module.exports = dashboard;
