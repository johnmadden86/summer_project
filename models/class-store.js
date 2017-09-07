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
    this.sortClasses();
    this.store.save();
  },

  createSchedule(newClass) {
    let i = 0;
    let sessionDate = new Date(newClass.details.date);
    sessionDate.setDate(sessionDate.getDate() + 0.5);
    while (i < newClass.details.weeks) {
      const session = {
        id: uuid(),
        date: sessionDate.getDate() + ' ' + staticMethods.monthFromDate(sessionDate) + ' ' + sessionDate.getFullYear().toString().substring(2),
        members: [],
        spaces: newClass.details.capacity,
        full: false,
        enrolled: false,
      };
      newClass.schedule.push(session);
      i++;
      sessionDate = new Date(sessionDate);
      sessionDate.setDate(sessionDate.getDate() + 7);
    }
  },

  getClassById(classId) {
    return this.store.findOneBy(this.collection, { id: classId });
  },

  removeClass(classToRemove) {
    this.store.remove(this.collection, classToRemove);
    this.store.save();
  },

  sortClasses() {
    this.getAllClasses().sort(
        function (a, b) {
          // + 6 mod 7 to put Sunday at end of week
          let dayA = ((new Date(a.details.date)).getDay() + 6) % 7;
          let dayB = ((new Date(b.details.date)).getDay() + 6) % 7;
          let timeA = (new Date(a.details.date)).getTime();
          let timeB = (new Date(b.details.date)).getTime();
          let nameA = a.details.name;
          let nameB = b.details.name;
          let dateA = (new Date(a.details.date));
          let dateB = (new Date(b.details.date));
          if (dayA !== dayB) {
            return dayA - dayB;
          } else if (timeA !== timeB) {
            return timeA - timeB;
          } else if (nameA !== nameB) {
            return nameA - nameB;
          } else {
            return dateA - dateB;
          }
        }
    );
  },

  getSession(classToJoin, sessionId) {
    for (let i = 0; i < classToJoin.schedule.length; i++) {
      if (classToJoin.schedule[i].id === sessionId) {
        return classToJoin.schedule[i];
      }
    }
  },

  save() {
    this.store.save();
  },
};

module.exports = classStore;
