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
    logger.info(`Deleting Assessment for ${loggedInUser.name.full}`);
    memberStore.removeAssessment(loggedInUser, assessmentId);
    response.redirect('/assessments');
  },

  trainerAssessment(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const memberId = request.params.id;
    const member = memberStore.getMemberById(memberId);
    const stats = analytics.generateDashboardStats(member);
    const viewData = {
      title: 'View Assessments',
      trainer: trainer,
      member: member,
      stats: stats,
    };
    response.cookie('member', member.email);
    logger.info(`Rendering assessments for ${member.name.full}`);
    response.render('trainer-assessment', viewData);
  },

  editComment(request, response) {
    const assessmentId = request.params.assessmentId;
    const comment = request.body.comment;
    const member = accounts.getCurrentMember(request);
    const assessment = memberStore.getAssessment(member.assessments, assessmentId);
    assessment.comment = comment;
    memberStore.save();
    logger.info(`Updating comment for ${member.name.full} on ${assessment.date}`);
    response.redirect(`/trainer-dashboard`);
  },

};

module.exports = assessments;
