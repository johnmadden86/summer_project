'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');

const memberStore = {

  store: new JsonStore('./models/member-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  removeMember(id) {
    const member = this.getMemberById(id);
    this.store.remove(this.collection, member);
    this.store.save();
  },

  addAssessment(member, assessment) {
    member.assessments.push(assessment);
    this.sortAssessments(member);
    this.store.save();
  },

  removeAssessment(user, assessmentId) {
    user.assessments = user.assessments.filter(
        function (el) {
          return el.assessmentId !== assessmentId;
        }
    );
    this.store.save();
  },

  sortAssessments(user) {
    user.assessments.sort(
        function (a, b) {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateA - dateB;
        }
    );
    user.assessments.reverse();
  },

  save() {
    this.store.save();
  }
};

module.exports = memberStore;
