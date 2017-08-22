'use strict';

const logger = require('./logger');

const staticMethods = {
  dayFromDate(date) {
    let day;
    switch (new Date(date).getDay()) {
      case 0:
        day = 'Sunday';
        break;
      case 1:
        day = 'Monday';
        break;
      case 2:
        day = 'Tuesday';
        break;
      case 3:
        day = 'Wednesday';
        break;
      case 4:
        day = 'Thursday';
        break;
      case 5:
        day = 'Friday';
        break;
      case 6:
        day = 'Saturday';
    }
    return day;
  },

  monthFromDate(date) {
    let day;
    switch (new Date(date).getMonth()) {
      case 0:
        day = 'Jan';
        break;
      case 1:
        day = 'Feb';
        break;
      case 2:
        day = 'Mar';
        break;
      case 3:
        day = 'Apr';
        break;
      case 4:
        day = 'May';
        break;
      case 5:
        day = 'Jun';
        break;
      case 6:
        day = 'Jul';
        break;
      case 7:
        day = 'Aug';
        break;
      case 8:
        day = 'Sep';
        break;
      case 9:
        day = 'Oct';
        break;
      case 10:
        day = 'Nov';
        break;
      case 11:
        day = 'Dec';
        break;
    }
    return day;
  },

  shortenedDateString(date) {
    return date.toDateString().substring(4, 10);
  },

  addOneWeek(date) {
    let newDate = new Date(date);
    newDate.setTime(newDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    return new Date(newDate);
  },

};

module.exports = staticMethods;

