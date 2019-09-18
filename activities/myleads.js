'use strict';
const faker = require('faker');
const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async function (activity) {
  try {
    const pagination = $.pagination(activity);
    let numberToGenerate = parseInt(pagination.pageSize)*2;

    let items = [];

    for (let i = 0; i < numberToGenerate; i++) {
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

    var dateRange = $.dateRange(activity);
    items = shared.filterItemsByDateRange(items, dateRange);
    let value = items.length;

    items = shared.paginateItems(items, pagination);

    activity.Response.Data.items = items;
    activity.Response.Data.title = T(activity, 'Leads');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Leads');

    activity.Response.Data.actionable = value > 0;

    activity.Response.Data.thumbnail = "https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg";

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.color = 'blue';
      activity.Response.Data.date = shared.getHighestDate(items);
      activity.Response.Data.description = value > 1 ? T(activity, "You have {0} leads.", value) :
        T(activity, "You have 1 lead.");
      activity.Response.Data.description += " The latest is <b>" + activity.Response.Data.items[0].title + "</b>.";
    } else {
      activity.Response.Data.description = T(activity, `You have no leads.`);
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};