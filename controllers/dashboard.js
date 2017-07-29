'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const analytics = require('../utils/analytics');
const memberStore = require('../models/member-store');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const stats = analytics.generateDashboardStats(loggedInUser);
    const viewData = {
      title: 'Dashboard',
      member: loggedInUser,
      stats: stats,
    };
    memberStore.sortAssessments(loggedInUser);
    logger.info(`dashboard rendering for ${loggedInUser.name}`);
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessment = request.body;
    const assessmentDate = request.body.date;
    assessment.assessmentId = uuid();
    assessment.trend = false;
    memberStore.addAssessment(loggedInUser, assessment);
    analytics.trend(loggedInUser);
    logger.info(`Adding new assessment for ${loggedInUser.name} on ${assessmentDate}`);
    response.redirect('/dashboard');
  },

  deleteAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessmentId = request.params.assessmentId;
    logger.debug(`Deleting Assessment for ${loggedInUser.name}`);
    memberStore.removeAssessment(loggedInUser, assessmentId);
    response.redirect('/dashboard');
  },

};

module.exports = dashboard;
