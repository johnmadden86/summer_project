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
    response.render('index', viewData);
  },

  signUp(request, response) {
    const viewData = {
      title: 'Registration',
    };
    response.render('signUp', viewData);
  },

  register(request, response) {

    const member = {
      id: uuid(),
      email: request.body.email,
      password: request.body.password,
      name: {
        first: request.body.firstName,
        last: request.body.lastName,
      },
      details: {
        height: request.body.height,
        startingWeight: request.body.startingWeight,
        gender: request.body.gender,
      },
      assessments: [],
    };
    member.name.full = member.name.first + ' ' + member.name.last;
    memberStore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.redirect('/login');
  },

  newTrainer(request, response) {
    const trainer = {
      id: uuid(),
      email: request.body.email,
      password: request.body.password,
      name: {
        first: request.body.firstName,
        last: request.body.lastName,
      },
    };
    trainer.name.full = member.name.first + ' ' + member.name.last;
    trainerStore.addTrainer(trainer);
    logger.info(`registering ${trainer.email}`);
    response.redirect('/login');
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  authenticate(request, response) {
    const member = memberStore.getMemberByEmail(request.body.email);
    //const trainer = trainerStore.getTrainerByEmail(request.body.email);
    if (member){// && member.password === request.body.password) {
      response.cookie('member', member.email);
      logger.info(`logging in ${member.name.full}`);
      response.redirect('/dashboard');
    } //else if (trainer && trainer.password === request.body.password) {
      //response.cookie('trainer', trainer.email);
      //logger.info(`logging in ${trainer.email}`);
      //response.redirect('/trainer-dashboard');}
    else {
      logger.info('Authentication failed');
      response.redirect('/login');
    }
  },

  getCurrentMember(request) {
    const memberEmail = request.cookies.member;
    return memberStore.getMemberByEmail(memberEmail);
  },

  /*getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return trainerStore.getMemberByEmail(trainerEmail);
  },*/

  logout(request, response) {
    response.cookie('member', '');
    response.redirect('/');
    logger.info('logging out...');
  },

  update(request, response) {
    const loggedInUser = accounts.getCurrentMember(request);
    loggedInUser.email = request.body.email;
    loggedInUser.password = request.body.password;
    loggedInUser.name.first = request.body.firstName;
    loggedInUser.name.last = request.body.lastName;
    loggedInUser.name.full = request.body.firstName + ' ' + request.body.lastName;
    loggedInUser.details.height = request.body.height;
    loggedInUser.details.startingWeight = request.body.startingWeight;
    loggedInUser.details.gender = request.body.gender;
    memberStore.save();
    response.redirect('/dashboard');
  },

};

module.exports = accounts;
