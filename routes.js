'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const about = require('./controllers/about.js');

router.get('/', accounts.index);
router.get('/signup', accounts.signup);
router.get('/login', accounts.login);

router.get('/about', about.index);

router.post('/register', accounts.register);

module.exports = router;
