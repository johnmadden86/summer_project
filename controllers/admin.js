'use strict';

const trainerStore = require('../models/trainer-store');
const memberStore = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const admin = {

  index(request, response) {
    const viewData = {
      title: 'Admin',
    };
    response.render('admin', viewData);
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
    trainer.name.full = trainer.name.first + ' ' + trainer.name.last;
    trainerStore.addTrainer(trainer);
    logger.info(`registering ${trainer.email}`);
    response.redirect('/login');
  },

  /*getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return trainerStore.getMemberByEmail(trainerEmail);
  },*/


};

module.exports = admin;
