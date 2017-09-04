'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const classes = require('./classes');
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

    const viewData = {
      title: 'Fitness Programmes',
      trainer: trainer,
      members: members,
      classes: classes,
      routines: routines,
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
    const oldCustom = fitnessStore.getRoutineById('custom');
    if (oldCustom) {
      fitnessStore.removeRoutine(oldCustom);
    }

    const newCustom = {
      id: 'custom',
      details: request.body,
      custom: true,
    };

    fitnessStore.addRoutine(newCustom);
    logger.info(`Custom routine added by ${trainer.name.full}`);
    response.redirect('/fitness-programmes');
  },

  newAssignment(request, response) {
    const member = memberStore.getMemberById(request.body.member);
    let routineIds = [];
    let routines = [];
    let i = 0;
    while (i < 5) {
      routineIds.push(request.body.routine[i]);
      i++;
    }

    routineIds.forEach(
        function (routineId) {
          let routine = fitnessStore.getRoutineById(routineId);
          if (!routine) {
            const classRoutine = classStore.getClassById(routineId);
            routine = {
              id: routineId,
              details: {
                name: classRoutine.details.name,
                difficulty: classRoutine.details.difficulty,
                description: 'Class',
              },
            };

            //enrols in all session of class
            classRoutine.schedule.forEach(
                function (session) {
                  classes.enrol(member, routine, session, true);
                }
            );
          }

          routines.push(routine);
        }
    );

    member.fitnessProgramme = routines;

    //remove custom routine if created
    const oldCustom = fitnessStore.getRoutineById('custom');
    if (oldCustom) {
      fitnessStore.removeRoutine(oldCustom);
    }

    memberStore.save();
    logger.info(`Assigning new fitness programme to ${member.name.full}`);
    response.redirect('/fitness-programmes');
  },

  deleteRoutine(request, response) {
    const routine = fitnessStore.getRoutineById(request.params.routineId);
    logger.info(`Deleting routine '${routine.details.name}'`);
    fitnessStore.removeRoutine(routine);
    response.redirect('/fitness-programmes');
  },

};

module.exports = fitness;
