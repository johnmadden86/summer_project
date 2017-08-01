'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const memberStore = require('../models/member-store');
const analytics = require('../utils/analytics');

const trainer = {

  index(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    const viewData = {
      title: 'Dashboard',
      trainer: loggedInUser,
      members: members,
    };
    logger.info(`dashboard rendering for ${loggedInUser.name.full}`);
    response.render('trainer-dashboard', viewData);
  },

  deleteMember(request, response) {
    const id = request.params.id;
    logger.debug(`Deleting member ${id}`);
    memberStore.removeMember(id);
    response.redirect('/trainer-dashboard');
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
    logger.debug(`Rendering assessments for ${member.name.full}`);
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
    response.redirect('/trainer-dashboard');
  },

};

module.exports = trainer;
