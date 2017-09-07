'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const memberStore = require('../models/member-store');
const classStore = require('../models/class-store');
const trainerStore = require('../models/trainer-store');
const analytics = require('../utils/analytics');
const goals = require('./goals');
const bookings = require('./bookings');
const classes = require('./classes');
const uuid = require('uuid');

const dashboard = {

  index(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    let latestAssessment = 'None';
    if (analytics.latestAssessment(loggedInUser)) {
      latestAssessment = analytics.latestAssessment(loggedInUser).date;
    }

    const currentGoal = goals.currentGoal(loggedInUser);
    const nextBooking = bookings.nextBooking(loggedInUser);
    const nextClass = classes.nextClass(loggedInUser);
    let openGoals = false;
    loggedInUser.goals.forEach(
        function (goal) {
          if (goal.status === 'Open' || goal.status === 'Awaiting Processing') {
            openGoals = true;
          }
        }
    );
    const stats = analytics.generateDashboardStats(loggedInUser);

    const viewData = {
      title: 'Dashboard',
      member: loggedInUser,
      openGoals: openGoals,
      stats: stats,
      latestAssessment: latestAssessment,
      currentGoal: currentGoal,
      nextBooking: nextBooking,
      nextClass: nextClass,
    };
    logger.info(`dashboard rendering for ${loggedInUser.name.full}`);
    response.render('dashboard', viewData);
  },

  trainerIndex(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    let fitnessProgCount = 0;
    members.forEach(
        function (member) {
          if (member.fitnessProgramme) {
            fitnessProgCount++;
          }
        }
    );

    const viewData = {
      title: 'Dashboard',
      trainer: loggedInUser,
      members: members,
      fitnessProgCount: fitnessProgCount,
      noOfClasses: classStore.getAllClasses().length,
      nextBooking: bookings.nextBookingTrainer(loggedInUser),
      nextClass: classes.nextClass(null),
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

  deleteMember(request, response) {
    const id = request.params.id;
    logger.info(`Deleting member ${id}`);
    memberStore.removeMember(id);
    response.redirect('/trainer-dashboard');
  },

  newTrainer(request, response) {
    const trainer = {
      id: uuid(),
      email: request.body.email,
      password: request.body.password,
      name: {
        first: request.body.firstName,
        last: request.body.lastName,
      },
      trainerBookings: [],
    };
    trainer.name.full = trainer.name.first + ' ' + trainer.name.last;
    trainerStore.addTrainer(trainer);
    logger.info(`registering ${trainer.email}`);
    response.redirect('/trainer-dashboard');
  },

};

module.exports = dashboard;
