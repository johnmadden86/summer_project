'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

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
    this.store.save();
  },

  removeAssessment(userId, assessmentId) {
    const member = this.getMemberById(userId);
    _.remove(member.assessments, { id: assessmentId });
    this.store.save();
  },

};

module.exports = memberStore;
