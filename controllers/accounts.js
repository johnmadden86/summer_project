'use strict';

const trainers = require('../models/trainer-store');
const members = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(response) {
    const viewData = {
      title: 'Welcome',
    };
    response.render('index', viewData);
  },

  signUp(response) {
    const viewData = {
      title: 'Registration',
    };
    response.render('signUp', viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid();
    member.fullName = member.firstName.concat(' ').concat(member.lastName);
    members.addMember(member);
    logger.info(`registering ${member.email}`);
    response.redirect('/');
  },

  login(response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  authenticate(request, response) {
    const member = members.getMemberByEmail(request.body.email);
    const trainer = trainers.getTrainerByEmail(request.body.email);
    if (member && member.password === request.body.password) {
      response.cookie('member', member.email);
      logger.info(`logging in ${member.email}`);
      response.redirect('/dashboard');
    } else if (trainer && trainer.password === request.body.password) {
      response.cookie('trainer', trainer.email);
      logger.info(`logging in ${trainer.email}`);
      response.redirect('/trainer-dashboard');
    } else {
      logger.info('Authentication failed');
      response.redirect('/login');
    }
  },

  getCurrentMember(request) {
    const memberEmail = request.cookies.members;
    return members.getMemberByEmail(memberEmail);
  },

  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainers;
    return trainers.getMemberByEmail(trainerEmail);
  },

  logout(response) {
    response.cookie('member', '');
    response.redirect('/');
    logger.info('logging out...');
  },

};

module.exports = accounts;
