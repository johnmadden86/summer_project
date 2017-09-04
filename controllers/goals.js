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
    const assessmentRequired = goals.goalStatusUpdate(loggedInUser);
    const viewData = {
      title: 'Goals',
      member: loggedInUser,
      stats: stats,
      assessmentRequired: assessmentRequired,
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
    goals.goalStatusUpdate(member);
    const viewData = {
      title: 'Goals',
      trainer: loggedInUser,
      member: member,
      stats: stats,
    };
    logger.info(`goals page rendering for ${member.name.full}`);
    response.render('trainer-goals', viewData);
  },

  goalStatusUpdate(member) {
    let assessmentRequired = false;
    member.goals.forEach(
        function (goal) {
          const today = new Date();
          const goalDate = new Date(goal.date);
          const threeDays = staticMethods.daysToNumber(3);

          if (goalDate - today < threeDays && goal.status === 'Open') {
            goal.status = 'Awaiting Processing';
          }

          if (goal.status === 'Awaiting Processing') {
            const assessment = analytics.latestAssessment(member);
            const assessmentDate = new Date(assessment.date);

            if (today - assessmentDate < threeDays) {
              if (goals.compareGoal(goal, assessment)) {
                goal.status = goals.compareGoal(goal, assessment);
              }
            } else {
              assessmentRequired = true;
            }
          }
        }
    );
    memberStore.save();
    return assessmentRequired;
  },

  compareGoal(goal, assessment) {
    let weight = true;
    let chest = true;
    let thigh = true;
    let upperArm = true;
    let waist = true;
    let hips = true;

    if (goal.weight) {// goal reached if within 2%
      weight = Math.abs((goal.weight - assessment.weight) / goal.weight) < 0.02;
    }

    if (goal.chest) {
      chest = Math.abs((goal.chest - assessment.chest) / goal.chest) < 0.02;
    }

    if (goal.thigh) {
      thigh = Math.abs((goal.thigh - assessment.thigh) / goal.thigh) < 0.02;
    }

    if (goal.upperArm) {
      upperArm = Math.abs((goal.upperArm - assessment.upperArm) / goal.upperArm) < 0.02;
    }

    if (goal.waist) {
      waist = Math.abs((goal.waist - assessment.waist) / goal.waist) < 0.02;
    }

    if (goal.hips) {
      hips = Math.abs((goal.hips - assessment.hips) / goal.hips) < 0.02;
    }

    if (weight && chest && thigh && upperArm && waist && hips) {
      return 'Achieved';
    } else {
      return 'Missed';
    }

  },

  currentGoal(member) {
    const today = new Date();
    let currentGoal = member.goals[0];
    if (currentGoal) {
      let goalDate = new Date(currentGoal.date);
      for (let i = 0; goalDate < today; i++) {
        currentGoal = member.goals[i];
        goalDate = new Date(currentGoal.date);
      }

      return currentGoal.date;

    } else {
      return 'No goal set';
    }

  },

};

module.exports = goals;
