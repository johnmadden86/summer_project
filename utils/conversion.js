'use strict';

const conversion = {
  round(numberToConvert, precision) {
    let p = Math.pow(10, precision);
    return Math.round(numberToConvert * p) / p;
  },

  convertKgToPounds(numberToConvert, precision) {
    return this.round(numberToConvert * 2.2, precision);
  },

  convertCmToInches(numberToConvert, precision) {
    return this.round(numberToConvert * 0.3937, precision);
  },
};

module.exports = conversion;