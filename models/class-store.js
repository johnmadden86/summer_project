'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');
const staticMethods = require('../utils/static-methods');
const uuid = require('uuid');

const classStore = {

  store: new JsonStore('./models/class-store.json', { classes: [] }),
  collection: 'classes',

  getAllClasses() {
    return this.store.findAll(this.collection);
  },

  addClass(newClass) {
    this.store.add(this.collection, newClass);
    this.createSchedule(newClass);
    this.sortClassesByDate();
    this.store.save();
  },

  createSchedule(newClass) {
    let i = 0;
    let sessionDate = new Date(newClass.details.date);
    logger.debug(newClass.weeks);
    while (i < newClass.details.weeks) {
      const session = {
        id: uuid(),
        date: staticMethods.shortenedDateString(sessionDate),
        members: [],
      };
      newClass.schedule.unshift(session);
      i++;
      sessionDate = staticMethods.addOneWeek(sessionDate);
    }
  },

  getClassById(classId) {
    return this.store.findOneBy(this.collection, { classId: classId });
  },

  removeClass(classToRemove) {
    this.store.remove(this.collection, classToRemove);
    this.store.save();
  },

  sortClassesByDate() {
    this.getAllClasses().sort(
        function (a, b) {
          let dateA = new Date(a.details.date);
          let dateB = new Date(b.details.date);
          return dateA - dateB;
        }
    );
    this.getAllClasses().reverse();
  },

  save() {
    this.store.save();
  },
};

module.exports = classStore;
