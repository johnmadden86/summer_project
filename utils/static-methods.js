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

