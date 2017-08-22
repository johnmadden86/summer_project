'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');
const staticMethods = require('../utils/static-methods');

const memberStore = {

  store: new JsonStore('./models/member-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.sortMembers();
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

  removeBooking(user, bookingId) {
    user.memberBookings = user.memberBookings.filter(
        function (el) {
          return el.id !== bookingId;
        }
    );
    this.store.save();
  },

  getAssessment(assessments, assessmentId) {
    for (let i = 0; i < assessments.length; i++) {
      if (assessments[i].assessmentId === assessmentId) {
        return assessments[i];
      }
    }
  },

  getBooking(bookings, bookingId) {
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].id === bookingId) {
        return bookings[i];
      }
    }
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

  sortMembers() {
    this.getAllMembers().sort(
        function (a, b) {
          let lastNameA = a.name.last;
          let lastNameB = b.name.last;
          let firstNameA = a.name.first;
          let firstNameB = b.name.first;
          if (lastNameA !== lastNameB) {
            return lastNameA - lastNameB;
          } else if (firstNameA !== firstNameB) {
            return firstNameA - firstNameA;
          }
        }
    );
  },

  sortBookings(user) {
    user.memberBookings.sort(
        function (a, b) {
          let timeA = (new Date(a.date)).getTime();
          let timeB = (new Date(b.date)).getTime();
          let dateA = (new Date(a.date));
          let dateB = (new Date(b.date));
          if (dateA !== dateB) {
            return dateA - dateB;
          } else if (timeA !== timeB) {
            return timeA - timeB;
          }
        }
    );
  },

  save() {
    this.store.save();
  },
};

module.exports = memberStore;
