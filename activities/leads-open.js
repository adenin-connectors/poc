'use strict';

const md5 = require('md5');
const faker = require('faker');

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    const pagination = $.pagination(activity);
    const numberToGenerate = parseInt(pagination.pageSize) * 2;

    let count = 0;
    let items = [];
    let readDate = (new Date(new Date().setDate(new Date().getDate() - 30))).toISOString(); // default read date 30 days in the past

    if (activity.Request.Query.readDate) readDate = activity.Request.Query.readDate;

    for (let i = 0; i < numberToGenerate; i++) {
      const d = new Date();

      d.setMinutes(d.getMinutes() - (i + 1) * (process.env.NODE_ENV === 'development' ? 3 : 25)); // shorter interval to debug readDate

      const item = {
        id: i.toString(),
        title: faker.name.findName(),
        description: faker.company.companyName(),
        link: generator.detailUrl(),
        date: d.toISOString()
      };

      if (item.date > readDate) count++;

      items.push(item);
    }

    const dateRange = $.dateRange(activity);

    items = shared.filterItemsByDateRange(items, dateRange);
    items = shared.paginateItems(items, pagination);

    // return explicit _hash
    activity.Response.Data._hash = md5(JSON.stringify(items));
    activity.Response.Data.items = items;
    activity.Response.Data.title = T(activity, 'Open Leads');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Leads');
    activity.Response.Data.actionable = items.length > 0;
    activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg';

    if (count > 0) {
      activity.Response.Data.value = count;
      activity.Response.Data.date = shared.getHighestDate(items);
      activity.Response.Data.description = count > 1 ? T(activity, 'You have {0} open leads.', count) : T(activity, 'You have 1 open lead.');
      activity.Response.Data.briefing = activity.Response.Data.description + ' The latest is <b>' + activity.Response.Data.items[0].title + '</b>.';
    } else {
      activity.Response.Data.description = T(activity, 'You have no open leads.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};