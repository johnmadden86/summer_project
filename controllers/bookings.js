'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const memberStore = require('../models/member-store');
const trainerStore = require('../models/trainer-store');
const uuid = require('uuid');

const bookings = {
  memberBookings(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const trainers = trainerStore.getAllTrainers();
    const viewData = {
      title: 'Bookings',
      member: loggedInUser,
      trainers: trainers,
    };
    logger.info(`Rendering bookings page for ${loggedInUser.name.full}`);
    response.render('member-bookings', viewData);
  },

  newBooking(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const trainer = trainerStore.getTrainerById(request.body.trainer);
    const date = request.body.date;
    const time = request.body.time;
    const id = uuid();
    const memberBooking = {
      id: id,
      trainerId: trainer.id,
      trainerName: trainer.name.full,
      date: date,
      time: time,
    };
    const trainerBooking = {
      id: id,
      memberId: loggedInUser.id,
      memberName: loggedInUser.name.full,
      date: date,
      time: time,
    };
    loggedInUser.memberBookings.push(memberBooking);
    memberStore.sortBookings(loggedInUser);
    trainer.trainerBookings.push(trainerBooking);
    trainerStore.sortBookings(trainer);
    logger.info(`Adding new booking for ${loggedInUser.name.full} on ${date} with ${trainer.name.full}`);
    memberStore.save();
    trainerStore.save();
    response.redirect('/member-bookings');
  },

  trainerBookings(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const viewData = {
      title: 'Bookings',
      trainer: loggedInUser,
    };
    logger.info(`bookings menu rendering for ${loggedInUser.name.full}`);
    response.render('trainer-bookings', viewData);
  },

  memberDelete(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const bookingId = request.params.bookingId;
    const booking = memberStore.getBooking(loggedInUser.memberBookings, bookingId);
    logger.debug(bookingId);
    logger.debug(loggedInUser.name.full);
    logger.debug(loggedInUser.memberBookings.length);
    logger.debug(booking);
    const trainer = trainerStore.getTrainerById(booking.trainerId);
    logger.debug(trainer);
    logger.debug(trainer.trainerBookings.length);
    memberStore.removeBooking(loggedInUser, bookingId);
    trainerStore.removeBooking(trainer, bookingId);
    logger.debug(loggedInUser.memberBookings.length);
    logger.debug(trainer.trainerBookings.length);
    response.redirect('/member-bookings');
  },

  trainerDelete(request, response) {
    const loggedInUser =  accounts.getCurrentTrainer(request);
    const bookingId = request.params.bookingId;
    const booking = trainerStore.getBooking(loggedInUser.trainerBookings, bookingId);
    logger.debug(bookingId);
    logger.debug(loggedInUser.name.full);
    logger.debug(loggedInUser.trainerBookings.length);
    logger.debug(booking);
    const member = memberStore.getMemberById(booking.memberId);
    logger.debug(member);
    logger.debug(member.memberBookings.length);
    trainerStore.removeBooking(loggedInUser, bookingId);
    memberStore.removeBooking(member, bookingId);
    logger.debug(loggedInUser.trainerBookings.length);
    logger.debug(member.memberBookings.length);
    response.redirect('/trainer-bookings');
  },

};

module.exports = bookings;
