'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    let items = [
      {
        id: "1054889",
        title: `PTO Request`,
        link: generator.detailUrl()
      },
      {
        id: "1054891",
        title: `Purchase Request`,
        link: generator.detailUrl()
      },
      {
        id: "1054878",
        title: `Feedback`,
        link: generator.detailUrl()
      },
      {
        id: "1054880",
        title: `Requirement to hire`,
        link: generator.detailUrl()
      }
    ];

    let sortedItems = getItemsBasedOnHour(activity, items);

    var dateRange = $.dateRange(activity, "today");
    let filteredItems = shared.filterItemsByDateRange(sortedItems, dateRange);

    const pagination = $.pagination(activity);
    let paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;
    let value = activity.Response.Data.items.length;
    activity.Response.Data.title = T(activity, 'My Approvals');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Approvals');
    activity.Response.Data.actionable = true;
    activity.Response.Data.value = value;
    activity.Response.Data.color = 'blue';
    activity.Response.Data.description = value > 1 ? T(activity, "You have {0} approvals.", value) : T(activity, "You have 1 approval.");
  } catch (error) {
    $.handleError(activity, error);
  }
};

//** returns new item[] reordered based on UTC hour of the day */
function getItemsBasedOnHour(activity, items) {
  let morningHour = 7;
  let afternoonHour = 17;
  let timeslot1 = new Date();
  timeslot1.setHours(morningHour);
  let timeslot2 = new Date();
  timeslot2.setHours(afternoonHour);

  let date = new Date();
  let startIndex = Math.floor((date.getUTCHours() % 12) / 2);

  let daysOffset = 0;
  let minsMultiplier = -90;
  let sortedItems = [];

  for (let i = 0; i < items.length; i++) {
    if (startIndex >= items.length) {
      startIndex = 0;
    }

    date.setMinutes(date.getMinutes() + (i * minsMultiplier) + shared.getRandomInt(minsMultiplier / 2));

    if (date.getHours() < morningHour) {
      daysOffset--;
      date.setDate(date.getDate() + daysOffset);
      date.setHours(timeslot2.getHours() - (timeslot1.getHours() - date.getHours()));
    }

    let itemDate = moment(date).tz(activity.Context.UserTimezone);

    items[startIndex].date = itemDate.toISOString();
    sortedItems.push(items[startIndex]);
    startIndex++;
  }

  return sortedItems;
}