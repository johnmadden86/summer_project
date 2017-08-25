'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const analytics = require('../utils/analytics');
const memberStore = require('../models/member-store');
const uuid = require('uuid');
const classStore = require('../models/class-store');

const goals = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const stats = analytics.generateDashboardStats(loggedInUser);
    const viewData = {
      title: 'Goals',
      member: loggedInUser,
      stats: stats,
    };
    memberStore.sortAssessments(loggedInUser);
    analytics.trend(loggedInUser);
    loggedInUser.goals.forEach(
        function (goal) {
          const today = new Date();
          logger.debug(today);
          const goalDate = new Date(goal.date);
          logger.debug(goalDate);
          logger.debug((today - goalDate));
          const threeDays = today.getDate() - goalDate.getDate() >= 3;
          if (threeDays && goal.status === 'Open') {
            goal.status = 'Awaiting Processing';
          }

        }
    );
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
    logger.info(`Adding new assessment for ${loggedInUser.name.full} on ${goalDate}`);
    response.redirect('/goals');
  },

  deleteGoal(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const goalId = request.params.goalId;
    logger.info(`Deleting goal for ${loggedInUser.name.full}`);
    memberStore.removeGoal(loggedInUser, goalId);
    response.redirect('/goals');
  },

};

module.exports = goals;
