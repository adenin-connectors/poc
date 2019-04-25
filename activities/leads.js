'use strict';
const faker = require('faker')
const generator = require('./common/generator');

module.exports = async function (activity) {
  try {
    var pagination = $.pagination(activity);
    let pageSize = parseInt(pagination.pageSize);

    let items = [];

    for (let i = 0; i < pageSize; i++) {
      let d = new Date();
      d.setMinutes(d.getMinutes() + (i+1)*25);
      const item = {
        id: i.toString(),
        title: faker.name.findName(),
        description: faker.company.companyName(),
        link: generator.detailUrl(),
        date: d.toISOString()
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