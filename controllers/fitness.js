'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const classStore = require('../models/class-store');
const fitnessStore = require('../models/fitness-store');
const memberStore = require('../models/member-store');
const staticMethods = require('../utils/static-methods');
const uuid = require('uuid');

const fitness = {

  trainerIndex(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const members = memberStore.getAllMembers();
    const classes = classStore.getAllClasses();
    const routines = fitnessStore.getAllRoutines();
    const custom = request.cookies.customRoutine;
    const viewData = {
      title: 'Fitness Programmes',
      trainer: trainer,
      members: members,
      classes: classes,
      routines: routines,
      custom: custom,
    };

    logger.info(`fitness programme menu rendering for ${trainer.name.full}`);
    response.render('fitness-programmes', viewData);
  },

  newRoutine(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const newRoutine = {
      id: uuid(),
      details: request.body,
    };
    fitnessStore.addRoutine(newRoutine);
    fitnessStore.save();
    logger.info(`New routine added by ${trainer.name.full}`);
    response.redirect('/fitness-programmes');
  },

  customRoutine(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const customRoutine = {
      id: uuid(),
      details: request.body,
    };
    response.cookie('customRoutine', customRoutine);
    logger.info(`Custom routine added by ${trainer.name.full}`);
    response.redirect('/fitness-programmes');
  },

  newAssignment(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const member = memberStore.getMemberById(request.body.member);
    let session1id = request.body.session;
    logger.debug(session1id);
    let session1 = classStore.getClassById(session1id);
    logger.debug(!session1);
    if (!session1) {
      session1 = fitnessStore.getRoutineById(session1id);
    }

    logger.debug(session1);

    member.fitnessProgramme = {
      //session1: request.body.session1,

      //session2: request.body.session2,
    };

    memberStore.save();
    logger.info(`Assigning new fitness programme to ${member.name.full}`);
    response.redirect('/fitness-programmes');
  },

};

module.exports = fitness;
