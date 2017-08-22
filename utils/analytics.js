'use strict';

const logger = require('./logger');
const conversion = require('./conversion');

const analytics = {

  generateDashboardStats(member) {
    const bmi = this.calculateBmi(member);
    const bmiCategory = this.determineBmiCategory(member);
    const ibw = this.isIdealBodyWeight(member);
    return {
      bmi: bmi,
      bmiCategory: bmiCategory,
      ibw: ibw,
    };
  },

  latestAssessment(member) {
    return member.assessments[0];
  },

  currentWeight(member) {
    let weight = member.details.startingWeight;
    if (member.assessments.length > 0) {
      weight = this.latestAssessment(member).weight;
    }

    return weight;
  },

  calculateBmi(member) {
    const weight = this.currentWeight(member);
    const height = member.details.height / 100;
    return conversion.round(weight / (height * height), 2);
  },

  determineBmiCategory(member) {
    const bmiValue = this.calculateBmi(member);
    const categories = ['Very Severely Underweight', 'Severely Underweight',
      'Underweight', 'Normal', 'Overweight', 'Moderately Obese', 'Severely Obese', 'Very Severely Obese',
    ];
    const ranges = [15, 16, 18.5, 25, 30, 35, 40];

    let bmiCategory = categories[0];
    for (let j = 0; j < ranges.length; j++) {
      if (bmiValue > ranges[j]) {
        bmiCategory = categories[j + 1];
      }
    }

    return bmiCategory;
  },

  isIdealBodyWeight(member) {
    const weight = this.currentWeight(member);
    const fiveFeet = 60.0;
    let idealBodyWeight;

    let inches = conversion.convertCmToInches(member.details.height, 2);

    if (inches <= fiveFeet) {
      // noinspection JSValidateTypes
      if (member.details.gender === 'Male') {
        idealBodyWeight = 50;
      } else {
        idealBodyWeight = 45.5;
      }
    } else {
      // noinspection JSValidateTypes
      if (member.details.gender === 'Male') {
        idealBodyWeight = 50 + ((inches - fiveFeet) * 2.3);
      } else {
        idealBodyWeight = 45.5 + ((inches - fiveFeet) * 2.3);
      }
    }

    idealBodyWeight = conversion.round(idealBodyWeight, 2);
    //logger.info('Ideal Weight ' + idealBodyWeight + ' kg');
    const marginOfError = Math.abs(idealBodyWeight - weight);
    return marginOfError <= 2;
  },

  trend(member) {
    const numberOfAssessments = member.assessments.length;
    const earliestAssessment = member.assessments[numberOfAssessments - 1];
    earliestAssessment.trend = earliestAssessment.weight <= member.details.startingWeight;

    if (numberOfAssessments > 1) {
      for (let i = 0; i < numberOfAssessments - 1; i++) {
        const oldWeight = member.assessments[i + 1].weight;
        const newWeight = member.assessments[i].weight;
        member.assessments[i].trend = newWeight <= oldWeight;
      }
    }
  },
};
module.exports = analytics;
