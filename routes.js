'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const about = require('./controllers/about.js');
const dashboard = require('./controllers/dashboard.js');
const trainer = require('./controllers/trainer.js');
const admin = require('./controllers/admin');

router.get('/', accounts.index);
router.get('/sign-up', accounts.signUp);
router.get('/login', accounts.login);
router.get('/logout', accounts.logout);
router.post('/authenticate', accounts.authenticate);
router.post('/register', accounts.register);
router.post('/settings', accounts.update);

router.get('/dashboard', dashboard.index);
router.get('/settings', dashboard.settings);
router.get('/dashboard/:userId/delete-assessment/:assessmentId', dashboard.deleteAssessment);
router.post('/dashboard/add-assessment', dashboard.addAssessment);
router.get('/classes', dashboard.classes);

router.get('/admin', admin.index);
router.post('/admin', admin.newTrainer);

router.get('/admin', admin.index);
router.post('/admin', admin.newTrainer);

router.get('/about', about.index);

router.get('/trainer-dashboard', trainer.index);
router.get('/trainer-dashboard/delete-member/:id', trainer.deleteMember);
router.get('/trainer-assessment/:id', trainer.trainerAssessment);
router.post('/trainer-assessment/:id/edit-comment/:assessmentId', trainer.editComment);

router.get('/view-members', trainer.members);
router.get('/trainer-classes', trainer.classes);
router.get('/trainer-classes/delete-class/:classId', trainer.deleteClass);
router.get('/trainer-classes/edit-class/:classId', trainer.editClass);
router.post('/new-class', trainer.newClass);



module.exports = router;
