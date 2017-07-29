'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const about = require('./controllers/about.js');
const dashboard = require('./controllers/dashboard.js');
const trainer = require('./controllers/trainer.js');

router.get('/', accounts.index);
router.get('/signup', accounts.signUp);
router.get('/login', accounts.login);
router.get('/logout', accounts.logout);
router.post('/authenticate', accounts.authenticate);
router.post('/register', accounts.register);
router.post('/settings', accounts.update);

router.get('/dashboard', dashboard.index);
router.get('/settings', dashboard.settings);
router.get('/dashboard/:userId/deleteassessment/:assessmentId', dashboard.deleteAssessment);
router.post('/dashboard/addassessment', dashboard.addAssessment);

router.get('/about', about.index);

//router.get('/trainerdashboard', TrainerDashboard.index);
//router.get('/trainerdashboard/deletemeber/{id}', TrainerDashboard.deleteMember);
//router.get('/trainerassessment/{id} ', TrainerDashboard.trainerAssessment);
//router.post('/editcomment/{id}', TrainerDashboard.editComment);

module.exports = router;
