'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const classStore = require('../models/class-store');
const staticMethods = require('../utils/static-methods');
const uuid = require('uuid');

const classes = {
  memberClasses(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const classes = classStore.getAllClasses();
    let k = 0;
    let all = false;
    let none = true;
    while (k < classes.length) {
      classes[k].schedule.forEach(
          function (session) {
            const sessionDate = new Date(session.date);
            logger.debug(sessionDate);
            const today = new Date();
            logger.debug(today);
            logger.debug(sessionDate < today);
            if (sessionDate < today) {
              session.full = true;
            }

            session.enrolled = false;//set all false for new user
            let i = 0;
            let j = 0;
            while (i < session.members.length) {
              if (session.members[i] === loggedInUser) {
                session.enrolled = true;//true only if current user is enrolled
                none = false;
                j++;
                if (j === session.members.length) {
                  all = true;
                }
              }

              i++;
            }
          }
      );
      k++;
    }

    const viewData = {
      title: 'Classes',
      member: loggedInUser,
      classes: classes,
      all: all,
      none: none,
    };
    logger.info(`classes menu rendering for ${loggedInUser.name.full}`);
    response.render('classes', viewData);
  },

  enrolOne(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const classId = request.params.classId;
    const classToJoin = classStore.getClassById(classId);
    const sessionId = request.params.sessionId;
    const session = classStore.getSession(classToJoin, sessionId);
    classes.enrol(loggedInUser, classToJoin, session, false);
    response.redirect('/classes');
  },

  enrolAll(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const classId = request.params.classId;
    const classToJoin = classStore.getClassById(classId);
    classToJoin.schedule.forEach(
        function (session) {
          classes.enrol(loggedInUser, classToJoin, session, true);
        }
    );
    response.redirect('/classes');
  },

  unEnrolAll(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const classId = request.params.classId;
    const classToJoin = classStore.getClassById(classId);
    classToJoin.schedule.forEach(
        function (session) {
          classes.unEnrol(loggedInUser, classToJoin, session);
        }
    );
    response.redirect('/classes');
  },

  unEnrol(loggedInUser, classToJoin, session) {
    let i = 0;
    let j = 0;
    while (i < session.members.length) {// i = 0 ensures loop runs at least once, covers for case length = 0
      if (session.members[i] === loggedInUser) {//remove if already enrolled
        session.members.splice(i, 1);
        session.spaces++;
        session.enrolled = false;
        logger.debug(`Removing ${loggedInUser.name.full} from ${classToJoin.details.name} on ${session.date}`);
        logger.debug(`${session.spaces} left in class`);
      } else {
        j++;
      }

      i++;
    }

  },

  enrol(loggedInUser, classToJoin, session, all) {
    let i = 0;//i controls while loop
    let j = 0;//counts members array for add method
    while (i === 0 || i < session.members.length) {// i = 0 ensures loop runs at least once, covers for case length = 0
      if (session.members[i] === loggedInUser) {//remove if already enrolled, if all do nothing
        if (!all) {
          session.members.splice(i, 1);
          session.spaces++;
          session.enrolled = false;
          logger.debug(`Removing ${loggedInUser.name.full} from ${classToJoin.details.name} on ${session.date}`);
          logger.debug(`${session.spaces} left in class`);
        }
      } else {
        if (j === session.members.length && !session.full) {//j cycles through full array, no removals
          session.members.push(loggedInUser);//adds member
          logger.debug(`Adding ${loggedInUser.name.full} to ${classToJoin.details.name} on ${session.date}`);
          session.spaces--;//decrement no. of spaces left
          session.enrolled = true;
          logger.debug(`${session.spaces} spaces left in class`);
          if (session.spaces === 0) {//mark full if no spaces left
            session.full = true;
            logger.debug(`${classToJoin.name} on ${session.date} is now full`);
          }

          j++;
        }
      }

      i++;
    }
  },

  trainerClasses(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const classes = classStore.getAllClasses();
    const viewData = {
      title: 'Classes',
      trainer: loggedInUser,
      classes: classes,
    };

    //remove classes that are finished
    classes.forEach(
        function (classListing) {
          let startDate = new Date(classListing.details.date);
          startDate.setDate(startDate.getDate() + 7 * classListing.details.weeks);
          const today = new Date();
          if (startDate < today) {
            classStore.removeClass(classListing);
          }
        }
    );
    logger.info(`classes menu rendering for ${loggedInUser.name.full}`);
    response.render('trainer-classes', viewData);
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
    logger.info(`Deleting Class ${classToRemove.details.name} starting on ${classToRemove.details.date}`);
    classStore.removeClass(classToRemove);
    response.redirect('/trainer-classes');
  },

  editClass(request, response) {
    const classId = request.params.classId;
    const viewData = {
      title: 'Edit Class',
      trainer: accounts.getCurrentTrainer(request),
      classToEdit: classStore.getClassById(classId),
    };
    response.cookie('classId', classId);
    response.render('edit-class', viewData);
  },

  updateClass(request, response) {
    const classId = request.cookies.classId;
    const classToEdit = classStore.getClassById(classId);
    classToEdit.details = request.body;
    classToEdit.details.day = staticMethods.dayFromDate(classToEdit.details.date);
    classStore.save();
    response.redirect('/trainer-classes');
  },

};

module.exports = classes;
