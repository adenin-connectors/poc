'use strict';
const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {

    let d = new Date();

    let items = [
      {
        id: "0",
        title: `Budget Plan ${d.getFullYear() + 1}`,
        description: `description 0`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, 0, 0).toISOString()
      },
      {
        id: "1",
        title: `Meeting Notes Project 35345`,
        description: `description 1`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 15, 0, 0).toISOString()
      },
      {
        id: "2",
        title: `Sales Report ${d.getMonth() - 1}.${d.getFullYear()}`,
        description: `description 2`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth(), 1, 10, 0, 0).toISOString()
      },
      {
        id: "3",
        title: `Form 232 Draft`,
        description: `description 3`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth(), -1, 11, 0, 0).toISOString()
      },
      {
        id: "4",
        title: `Sales Report ${d.getMonth() - 2}.${d.getFullYear()}`,
        description: `description 4`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth() - 1, 1, 14, 0, 0).toISOString()
      }
    ];

    
    var dateRange = $.dateRange(activity, "today");
    items = shared.filterItemsByDateRange(items, dateRange);
    let value = items.length;

    const pagination = $.pagination(activity);
    items = shared.paginateItems(items, pagination);

    activity.Response.Data.items = items;
    activity.Response.Data.title = T(activity, 'Documents');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Documents');

    activity.Response.Data.actionable = value > 0;

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.date = shared.getHighestDate(items);
      activity.Response.Data.color = 'blue';
      activity.Response.Data.description = value > 1 ? T(activity, "There are {0} documents.", value)
        : T(activity, "There is 1 document.");
    } else {
      activity.Response.Data.description = T(activity, 'There are no documents.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};
