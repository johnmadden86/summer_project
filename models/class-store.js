'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');

const classStore = {

  store: new JsonStore('./models/class-store.json', { classes: [] }),
  collection: 'classes',

  getAllClasses() {
    return this.store.findAll(this.collection);
  },

  addClass(newClass) {
    this.store.add(this.collection, newClass);
    this.sortClassesByDate();
    this.store.save();
  },

  getClassById(classId) {
    return this.store.findOneBy(this.collection, { classId: classId });
  },

  removeClass(classId) {
    const classToRemove = this.getClassById(classId);
    logger.debug(classToRemove.classId);
    logger.debug(this.collection);
    this.store.remove(this.collection, classToRemove);
    this.store.save();
  },

  sortClassesByDate() {
    this.getAllClasses().sort(
        function (a, b) {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
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
