'use strict';
const faker = require('faker')
const generator = require('./common/generator');

module.exports = async function (activity) {
  try {
    let items = [];
    let conunt = Math.floor(Math.random() * 10); 

    for (let i = 0; i < conunt; i++) {
      const item = {
        id: i,
        title: faker.name.findName(),
        description: faker.company.companyName(),
        link: generator.detailUrl(),
      };
      items.push(item);
    }

    activity.Response.Data.items = items;
    activity.Response.Data.title = T(activity, 'Leads');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Leads');
  } catch (error) {
    $.handleError(activity, error);
  }
};