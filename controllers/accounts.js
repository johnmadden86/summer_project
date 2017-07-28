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
    const member = request.body;
    member.id = uuid();
    member.fullName = member.firstName.concat(' ').concat(member.lastName);
    member.assessments = [];
    memberStore.addMember(member);
    logger.info(`registering ${member.email}`);
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
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
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
    const memberEmail = request.cookies.member;
    return memberStore.getMemberByEmail(memberEmail);
  },

  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return trainerStore.getMemberByEmail(trainerEmail);
  },

  logout(request, response) {
    response.cookie('member', '');
    response.redirect('/');
    logger.info('logging out...');
  },

};

module.exports = accounts;
