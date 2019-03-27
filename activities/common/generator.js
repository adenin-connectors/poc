'use strict';

const faker = require('faker');

module.exports = {
  randomEntry: function (arr) {
    const rnd = Math.floor(0.5 + Math.random() * 100);
    const i = rnd % arr.length;

    return arr[i];
  },
  detailUrl: function () {
    return 'https://www.adenin.com/pocdef';
  },
  teamMember: function () {
    return {
      name: faker.name.findName()
    };
  }
};
