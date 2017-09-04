'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');
const staticMethods = require('../utils/static-methods');
const uuid = require('uuid');

const fitnessStore = {

  store: new JsonStore('./models/fitness-store.json', { fitnessProgrammes: [] }),
  collection: 'fitnessProgrammes',

  getAllRoutines() {
    return this.store.findAll(this.collection);
  },

  addRoutine(newRoutine) {
    this.store.add(this.collection, newRoutine);

    this.store.save();
  },

  getRoutineById(routineId) {
    return this.store.findOneBy(this.collection, { id: routineId });
  },

  removeRoutine(programme) {
    this.store.remove(this.collection, programme);
    this.store.save();
  },

  sortProgrammes() {
    this.getAllProgrammes().sort(
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

  save() {
    this.store.save();
  },
};

module.exports = fitnessStore;
