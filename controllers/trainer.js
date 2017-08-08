'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const memberStore = require('../models/member-store');
const analytics = require('../utils/analytics');
const staticMethods = require('../utils/static-methods');
const classStore = require('../models/class-store');
const uuid = require('uuid');

const trainer = {

  index(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const viewData = {
      title: 'Dashboard',
      trainer: loggedInUser,
    };
    logger.info(`dashboard rendering for ${loggedInUser.name.full}`);
    response.render('trainer-dashboard', viewData);
  },

  members(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    const viewData = {
      title: 'Members',
      trainer: loggedInUser,
      members: members,
    };
    logger.info(`member list rendering for ${loggedInUser.name.full}`);
    response.render('view-members', viewData);
  },

  classes(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const classes = classStore.getAllClasses();
    const viewData = {
      title: 'Classes',
      trainer: loggedInUser,
      classes: classes,
    };
    logger.info(`classes menu rendering for ${loggedInUser.name.full}`);
    response.render('trainer-classes', viewData);
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
    response.redirect(`/trainer-dashboard`);
  },

  newClass(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const newClass = {
      classId: uuid(),
      details: request.body,
      schedule: [],
    };
    newClass.details.day = staticMethods.dayFromDate(newClass.details.date);
    classStore.addClass(newClass);
    logger.info(`New class added by ${loggedInUser.name.full}`);
    response.redirect('/trainer-classes');
  },

  deleteClass(request, response) {
    const classId = request.params.classId;
    const classToRemove = classStore.getClassById(classId);
    logger.debug(`Deleting Class ${classToRemove.name} ${classToRemove.date}`);
    classStore.removeClass(classToRemove);
    response.redirect('/trainer-classes');
  },

  editClass(request, response) {
    const classId = request.params.classId;
    const details = request.body;
    const classToEdit = classStore.getClassById(classId);
    classToEdit.details = details;
    classStore.save();
    logger.info(`Updating details for ${classId}`);
    response.redirect(`/trainer-classes`);
  },

};

module.exports = trainer;
