'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const analytics = require('../utils/analytics');
const memberStore = require('../models/member-store');
const uuid = require('uuid');
const classStore = require('../models/class-store');
const staticMethods = require('../utils/static-methods');

const goals = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const stats = analytics.generateDashboardStats(loggedInUser);
    memberStore.sortGoals(loggedInUser);
    analytics.trend(loggedInUser);
    loggedInUser.goals.forEach(
        function (goal) {
          const today = new Date();
          const goalDate = new Date(goal.date);
          const threeDays = staticMethods.daysToNumber(3);
          if (goalDate - today < threeDays && goal.status === 'Open') {
            goal.status = 'Awaiting Processing';
          }
        }
    );
    const viewData = {
      title: 'Goals',
      member: loggedInUser,
      stats: stats,
    };
    logger.info(`goals page rendering for ${loggedInUser.name.full}`);
    response.render('goals', viewData);
  },

  addGoal(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const goal = request.body;
    const goalDate = request.body.date;
    goal.id = uuid();
    goal.status = 'Open';
    memberStore.addGoal(loggedInUser, goal);
    logger.info(`Adding new goal for ${loggedInUser.name.full} on ${goalDate}`);
    response.redirect('/goals');
  },

  deleteGoal(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const goalId = request.params.goalId;
    logger.info(`Deleting goal for ${loggedInUser.name.full}`);
    memberStore.removeGoal(loggedInUser, goalId);
    response.redirect('/goals');
  },

  trainerIndex(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const memberId = request.params.memberId;
    const member = memberStore.getMemberById(memberId);
    memberStore.sortGoals(member);
    const stats = analytics.generateDashboardStats(member);
    analytics.trend(member);
    member.goals.forEach(
        function (goal) {
          const today = new Date();
          const goalDate = new Date(goal.date);
          const threeDays = staticMethods.daysToNumber(3);
          if (goalDate - today < threeDays && goal.status === 'Open') {
            goal.status = 'Awaiting Processing';
          }
        }
    );
    const viewData = {
      title: 'Goals',
      trainer: loggedInUser,
      member: member,
      stats: stats,
    };
    logger.info(`goals page rendering for ${member.name.full}`);
    response.render('trainer-goals', viewData);
  },

};

module.exports = goals;
