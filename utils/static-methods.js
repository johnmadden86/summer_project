'use strict';

const logger = require('./logger');

const staticMethods = {
  dayFromDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  },

  monthFromDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date(date).getMonth()];
  },

  daysToNumber(days) {
    return 1000 * 60 * 60 * 24 * days;
  },

  shortenedDateString(date) {
    return date.toDateString().substring(4, 10);
  },

  addOneWeek(date) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    return new Date(newDate);
  },

};

module.exports = staticMethods;

