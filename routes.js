'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts');
const about = require('./controllers/about');
const dashboard = require('./controllers/dashboard');
const classes = require('./controllers/classes');
const bookings = require('./controllers/bookings');
const trainer = require('./controllers/trainer');
const admin = require('./controllers/admin');
const goals = require('./controllers/goals');

router.get('/', accounts.index);
router.get('/sign-up', accounts.signUp);
router.get('/login', accounts.login);
router.get('/logout', accounts.logout);
router.post('/authenticate', accounts.authenticate);
router.post('/register', accounts.register);
router.post('/settings', accounts.update);

router.get('/dashboard', dashboard.index);
router.get('/settings', dashboard.settings);
router.get('/goals', goals.index);
router.post('/goals/add-goal', goals.addGoal);
router.get('/goals/:userId/delete-goal/:goalId', goals.deleteGoal);

router.get('/dashboard/:userId/delete-assessment/:assessmentId', dashboard.deleteAssessment);
router.post('/dashboard/add-assessment', dashboard.addAssessment);
router.get('/classes', classes.memberClasses);
router.get('/classes/:classId/enrol-one/:sessionId', classes.enrolOne);
router.get('/classes/:classId/enrol-all', classes.enrolAll);
router.get('/classes/:classId/unenrol-all', classes.unEnrolAll);
router.get('/member-bookings', bookings.memberBookings);
router.post('/member-bookings/new-booking', bookings.newBooking);
router.get('/member-bookings/delete-booking/:bookingId', bookings.memberDelete);
router.get('/trainer-bookings/delete-booking/:bookingId', bookings.trainerDelete);
router.get('/trainer-bookings/add-booking-details/:bookingId', bookings.update);
router.post('/trainer-bookings/add-booking-details/assessment/:bookingId', bookings.assessment);
router.post('/trainer-bookings/add-booking-details/repeat-booking/:memberId', bookings.repeatBooking);

router.get('/admin', admin.index);
router.post('/admin', admin.newTrainer);

router.get('/about', about.index);

router.get('/trainer-dashboard', trainer.index);
router.get('/trainer-dashboard/delete-member/:id', trainer.deleteMember);
router.get('/trainer-assessment/:id', trainer.trainerAssessment);
router.post('/trainer-assessment/:id/edit-comment/:assessmentId', trainer.editComment);
router.get('/trainer-bookings', bookings.trainerBookings);
router.get('/view-members', trainer.members);
router.get('/trainer-classes', classes.trainerClasses);
router.get('/trainer-classes/delete-class/:classId', classes.deleteClass);
router.get('/trainer-classes/edit-class/:classId', classes.editClass);
router.post('/trainer-classes/update-class/:classId', classes.updateClass);
router.post('/new-class', classes.newClass);

module.exports = router;
