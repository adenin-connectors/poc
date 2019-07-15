'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    let items = [
      {
        id: "1054889",
        title: `Facility Alert`,
        link: generator.detailUrl()
      }
    ];

    let sortedItems = shared.getItemsBasedOnHour(activity, items);

    var dateRange = $.dateRange(activity);
    let filteredItems = shared.filterItemsByDateRange(sortedItems, dateRange);
    let value = filteredItems.length;
    
    const pagination = $.pagination(activity);
    let paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;
    activity.Response.Data.title = T(activity, 'My Alerts');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Alerts');
    activity.Response.Data.actionable = value>0;
    if(value>0){
      activity.Response.Data.value = value;
      activity.Response.Data.date = shared.getHighestDate(paginatedItems);
      activity.Response.Data.color = 'blue';
      activity.Response.Data.description = value > 1 ? T(activity, "You have {0} alerts.", value) : T(activity, "You have 1 alert.");
    }else {
      activity.Response.Data.description = T(activity, `You have no alerts.`);
    }

  } catch (error) {
    $.handleError(activity, error);
  }
};