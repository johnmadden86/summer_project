'use strict';

const accounts = require('./accounts');
const logger = require('../utils/logger');
const memberStore = require('../models/member-store');
const trainerStore = require('../models/trainer-store');
const analytics = require('../utils/analytics');
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

    //remove old bookings
    loggedInUser.memberBookings.forEach(
        function (booking) {
          if (new Date(booking.date) < new Date()) {
            memberStore.removeBooking(loggedInUser, booking.id);
          }
        }
    );
    logger.info(`Rendering bookings page for ${loggedInUser.name.full}`);
    response.render('member-bookings', viewData);
  },

  newBooking(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const trainer = trainerStore.getTrainerById(request.body.trainer);
    const date = request.body.date;
    const time = request.body.time;
    bookings.makeBooking(loggedInUser, trainer, date, time);
    response.redirect('/member-bookings');
  },

  makeBooking(member, trainer, date, time) {
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
      memberId: member.id,
      memberName: member.name.full,
      date: date,
      time: time,
    };
    member.memberBookings.push(memberBooking);
    memberStore.sortBookings(member);
    trainer.trainerBookings.push(trainerBooking);
    trainerStore.sortBookings(trainer);
    logger.info(`Adding new booking for ${member.name.full} on ${date} at ${time} with ${trainer.name.full}`);
    memberStore.save();
    trainerStore.save();
  },

  trainerBookings(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const viewData = {
      title: 'Bookings',
      trainer: loggedInUser,
    };

    //remove bookings over a month old
    loggedInUser.trainerBookings.forEach(
        function (booking) {
          let oneMonthAgo = (new Date());
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          if (new Date(booking.date) < (oneMonthAgo)) {
            trainerStore.removeBooking(loggedInUser, booking.id);
          }
        }
    );
    logger.info(`bookings menu rendering for ${loggedInUser.name.full}`);
    response.render('trainer-bookings', viewData);
  },

  memberDelete(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const bookingId = request.params.bookingId;
    const booking = memberStore.getBooking(loggedInUser.memberBookings, bookingId);
    const trainer = trainerStore.getTrainerById(booking.trainerId);
    logger.info(`Deleting booking for ${loggedInUser.name.full} with ${trainer.name.full} on ${booking.date}`);
    memberStore.removeBooking(loggedInUser, bookingId);
    trainerStore.removeBooking(trainer, bookingId);
    response.redirect('/member-bookings');
  },

  trainerDelete(request, response) {
    const loggedInUser =  accounts.getCurrentTrainer(request);
    const bookingId = request.params.bookingId;
    const booking = trainerStore.getBooking(loggedInUser.trainerBookings, bookingId);
    const member = memberStore.getMemberById(booking.memberId);
    logger.info(`Canceling booking for ${loggedInUser.name.full} with ${member.name.full} on ${booking.date}`);
    trainerStore.removeBooking(loggedInUser, bookingId);
    memberStore.removeBooking(member, bookingId);
    response.redirect('/trainer-bookings');
  },

  update(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const bookingId = request.params.bookingId;
    const booking = trainerStore.getBooking(trainer.trainerBookings, bookingId);
    const memberId = booking.memberId;
    const member = memberStore.getMemberById(memberId);
    const assessment = memberStore.getAssessment(member.assessments, bookingId);
    const stats = analytics.generateDashboardStats(member);
    response.cookie('memberId', memberId);
    response.cookie('assessmentId', bookingId);
    const viewData = {
      title: 'Add Assessment Details',
      trainer: trainer,
      member: member,
      date: booking.date,
      assessment: assessment,
      stats: stats,
    };
    logger.debug(stats);
    response.render('edit-booking', viewData);
  },

  assessment(request, response) {
    const assessmentId = request.cookies.assessmentId;
    const memberId = request.cookies.memberId;
    const member = memberStore.getMemberById(memberId);
    const booking = memberStore.getBooking(member.memberBookings, assessmentId);
    let assessment = memberStore.getAssessment(member.assessments, assessmentId);
    if (!assessment) {
      assessment = {
        date: booking.date,
        assessmentId: assessmentId,
        trend: false,
      };
      memberStore.addAssessment(member, assessment);
    }

    assessment.weight = request.body.weight;
    assessment.chest = request.body.chest;
    assessment.thigh = request.body.thigh;
    assessment.upperArm = request.body.upperArm;
    assessment.waist = request.body.waist;
    assessment.hips = request.body.hips;
    assessment.comment = request.body.comment;
    logger.info(`Updating assessment for ${member.name.full} on ${booking.date}`);
    memberStore.save();
    response.redirect('/trainer-bookings');
  },

  repeatBooking(request, response) {
    const loggedInUser = accounts.getCurrentTrainer(request);
    const member = memberStore.getMemberById(request.cookies.memberId);
    const date = request.body.date;
    const time = request.body.time;
    bookings.makeBooking(member, loggedInUser, date, time);
    response.redirect('/trainer-bookings');
  },

};

module.exports = bookings;
