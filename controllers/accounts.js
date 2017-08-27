'use strict';

const trainerStore = require('../models/trainer-store');
const memberStore = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Welcome',
    };
    logger.info('Rendering index');
    response.render('index', viewData);
  },

  signUp(request, response) {
    const viewData = {
      title: 'Registration',
    };
    logger.info('Rendering Sign-Up');
    response.render('sign-up', viewData);
  },

  register(request, response) {
    const member = {
      id: uuid(),
      email: request.body.email,
      password: request.body.password,
      name: {
        first: request.body.firstName,
        last: request.body.lastName,
        full: request.body.firstName + ' ' + request.body.lastName,
      },
      details: {
        height: request.body.height,
        startingWeight: request.body.startingWeight,
        gender: request.body.gender,
      },
      assessments: [],
      memberBookings: [],
      goals: [],
    };

    memberStore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.redirect('/login');
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    logger.info('Rendering Login');
    logger.debug(request.cookies);
    response.render('login', viewData);
  },

  authenticate(request, response) {
    const member = memberStore.getMemberByEmail(request.body.email);
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    if (member){// && member.password === request.body.password) {
      response.cookie('memberId', member.id);
      logger.info(`logging in ${member.name.full}`);
      response.redirect('/dashboard');
    } else if (trainer){//} && trainer.password === request.body.password) {
      response.cookie('trainerId', trainer.id);
      logger.info(`logging in ${trainer.name.full}`);
      response.redirect('/trainer-dashboard');
    } else {
      logger.info('Authentication failed');
      response.redirect('/login');
    }
  },

  getCurrentMember(request) {
    const memberId = request.cookies.memberId;
    return memberStore.getMemberById(memberId);
  },

  getCurrentTrainer(request) {
    const trainerId = request.cookies.trainerId;
    return trainerStore.getTrainerById(trainerId);
  },

  logout(request, response) {
    response.cookie('memberId', '');
    response.cookie('trainerId', '');
    response.cookie('classId', '');
    response.redirect('/');
    logger.info('logging out...');
  },

  settings(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    const viewData = {
      member: loggedInUser,
    };
    logger.info(`Rendering settings page for ${loggedInUser.name.full}`);
    response.render('settings', viewData);
  },

  update(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    loggedInUser.email = request.body.email;
    loggedInUser.password = request.body.password;
    loggedInUser.name = {
      first: request.body.firstName,
      last: request.body.lastName,
      full: request.body.firstName + ' ' + request.body.lastName,
    };
    loggedInUser.details.height = request.body.height;
    loggedInUser.details.startingWeight = request.body.startingWeight;
    loggedInUser.details.gender = request.body.gender;

    memberStore.save();
    logger.info(`Profile updated for ${loggedInUser.name.full}`);
    response.redirect('/dashboard');
  },

};

module.exports = accounts;
