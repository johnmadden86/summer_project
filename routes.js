'use strict';

const express = require('express');
const router = express.Router();

const about = require('./controllers/about');
const accounts = require('./controllers/accounts');
const admin = require('./controllers/admin');
const assessments = require('./controllers/assessments');
const classes = require('./controllers/classes');
const bookings = require('./controllers/bookings');
const dashboard = require('./controllers/dashboard');
const fitness = require('./controllers/fitness');
const goals = require('./controllers/goals');

router.get('/', accounts.index);
router.get('/sign-up', accounts.signUp);
router.get('/login', accounts.login);
router.get('/logout', accounts.logout);
router.post('/authenticate', accounts.authenticate);
router.post('/register', accounts.register);
router.post('/settings', accounts.update);
router.get('/settings', accounts.settings);

router.get('/dashboard', dashboard.index);
router.get('/view-members', dashboard.members);
router.get('/trainer-dashboard', dashboard.trainerIndex);
router.get('/trainer-dashboard/delete-member/:id', dashboard.deleteMember);

router.get('/assessments', assessments.index);
router.get('/assessments/:userId/delete-assessment/:assessmentId', assessments.deleteAssessment);
router.post('/assessments/add-assessment', assessments.addAssessment);
router.get('/trainer-assessment/:id', assessments.trainerAssessment);
router.post('/trainer-assessment/:id/edit-comment/:assessmentId', assessments.editComment);

router.get('/goals', goals.index);
router.get('/trainer-goals/:memberId', goals.trainerIndex);
router.post('/goals/add-goal', goals.addGoal);
router.get('/goals/:userId/delete-goal/:goalId', goals.deleteGoal);

router.get('/classes', classes.memberClasses);
router.get('/classes/:classId/enrol-one/:sessionId', classes.enrolOne);
router.get('/classes/:classId/enrol-all', classes.enrolAll);
router.get('/classes/:classId/unenrol-all', classes.unEnrolAll);

router.get('/trainer-classes', classes.trainerClasses);
router.get('/trainer-classes/delete-class/:classId', classes.deleteClass);
router.get('/trainer-classes/edit-class/:classId', classes.editClass);
router.post('/trainer-classes/update-class/:classId', classes.updateClass);
router.post('/new-class', classes.newClass);

router.get('/member-bookings', bookings.memberBookings);
router.post('/member-bookings/new-booking', bookings.newBooking);
router.get('/member-bookings/delete-booking/:bookingId', bookings.memberDelete);
router.get('/trainer-bookings/delete-booking/:bookingId', bookings.trainerDelete);
router.get('/trainer-bookings/add-booking-details/:bookingId', bookings.update);
router.post('/trainer-bookings/add-booking-details/assessment/:bookingId', bookings.assessment);
router.post('/trainer-bookings/add-booking-details/repeat-booking/:memberId', bookings.repeatBooking);
router.get('/trainer-bookings', bookings.trainerBookings);

router.get('/admin', admin.index);
router.post('/admin', admin.newTrainer);

router.get('/about', about.index);

router.get('/fitness-programmes', fitness.trainerIndex);
router.post('/fitness-programmes/new-session', fitness.newRoutine);
router.post('/fitness-programmes/custom-session', fitness.customRoutine);
router.post('/fitness-programmes/new-assignment', fitness.newAssignment);
router.get('/fitness-programmes/delete-routine/:routineId', fitness.deleteRoutine);

module.exports = router;
