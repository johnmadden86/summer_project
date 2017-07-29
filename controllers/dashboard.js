'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const analytics = require('../utils/analytics');
const memberStore = require('../models/member-store');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const bmi = analytics.calculateBmi(loggedInUser);
    const bmiCategory = analytics.determineBmiCategory(loggedInUser);
    const ibw = analytics.isIdealBodyWeight(loggedInUser);
    const viewData = {
      title: 'Dashboard',
      member: loggedInUser,
      bmi: bmi,
      bmiCategory: bmiCategory,
      ibw: ibw,
    };
    memberStore.sortAssessments(loggedInUser);
    logger.info(`dashboard rendering for ${loggedInUser.firstName}`);
    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessment = request.body;
    assessment.assessmentId = uuid();
    memberStore.addAssessment(loggedInUser, assessment);
    logger.info(`Adding new assessment for ${loggedInUser.id}`);
    response.redirect('/dashboard');
  },

  deleteAssessment(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const assessmentId = request.params.assessmentId;
    logger.debug(`Deleting Assessment ${assessmentId} for ${loggedInUser.id}`);
    memberStore.removeAssessment(loggedInUser, assessmentId);
    response.redirect('/dashboard');
  },

};

module.exports = dashboard;
