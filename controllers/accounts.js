'use strict';

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Welcome',
    };
    response.render('index', viewData);
  },

  signup(request, response) {
    const viewData = {
      title: 'Registration',
    };
    response.render('signup', viewData);
  },
  
  register(request, response) {
    const user = request.body;
    //user.id = uuid();
    //memberstore.addUser(user);
    //logger.info(`registering ${user.email}`);
    response.redirect('/');
  },
  
  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

}

module.exports = accounts;
