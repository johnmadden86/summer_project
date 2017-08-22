'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const trainerStore = {

  store: new JsonStore('./models/trainer-store.json', { trainers: [] }),
  collection: 'trainers',

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },

  addTrainer(trainer) {
    this.store.add(this.collection, trainer);
    this.sortTrainers();
    this.store.save();
  },

  getTrainerById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  addMemberList(id, members) {
    const trainer = this.getTrainerById(id);
    trainer.members.push(members);
    this.store.save();
  },

  save() {
    this.store.save();
  },

  sortTrainers() {
    this.getAllTrainers().sort(
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

  getBooking(bookings, bookingId) {
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].id === bookingId) {
        return bookings[i];
      }
    }
  },

  removeBooking(user, bookingId) {
    user.trainerBookings = user.trainerBookings.filter(
        function (el) {
          return el.id !== bookingId;
        }
    );
    this.store.save();
  },

  sortBookings(user) {
    user.trainerBookings.sort(
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

};

module.exports = trainerStore;
