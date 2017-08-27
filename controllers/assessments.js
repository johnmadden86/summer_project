'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const analytics = require('../utils/analytics');
const memberStore = require('../models/member-store');
const uuid = require('uuid');
const classStore = require('../models/class-store');

const assessments = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const stats = analytics.generateDashboardStats(loggedInUser);
    const viewData = {
      title: 'Assessments',
      member: loggedInUser,
      stats: stats,
    };
    memberStore.sortAssessments(loggedInUser);
    analytics.trend(loggedInUser);
    logger.info(`assessments rendering for ${loggedInUser.name.full}`);
    response.render('assessments', viewData);
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
    response.redirect('/assessments');
  },

  deleteAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessmentId = request.params.assessmentId;
    logger.debug(`Deleting Assessment for ${loggedInUser.name.full}`);
    memberStore.removeAssessment(loggedInUser, assessmentId);
    response.redirect('/assessments');
  },



};

module.exports = assessments;
