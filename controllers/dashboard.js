'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const analytics = require('../utils/analytics');
const memberStore = require('../models/member-store');
const uuid = require('uuid');
const classStore = require('../models/class-store');

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
    analytics.trend(loggedInUser);
    logger.info(`dashboard rendering for ${loggedInUser.name.full}`);
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessment = request.body;
    const assessmentDate = request.body.date;
    assessment.assessmentId = uuid();
    assessment.comment = '';
    assessment.trend = false;
    memberStore.addAssessment(loggedInUser, assessment);
    logger.info(`Adding new assessment for ${loggedInUser.name.full} on ${assessmentDate}`);
    response.redirect('/dashboard');
  },

  deleteAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessmentId = request.params.assessmentId;
    logger.debug(`Deleting Assessment for ${loggedInUser.name.full}`);
    memberStore.removeAssessment(loggedInUser, assessmentId);
    response.redirect('/dashboard');
  },

  settings(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const viewData = {
      member: loggedInUser,
    };
    logger.info(`Rendering settings page for ${loggedInUser.name.full}`);
    response.render('settings', viewData);
  },

};

module.exports = dashboard;
