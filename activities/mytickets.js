'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');

module.exports = async (activity) => {
  try {
    let items = [
      {
        id: "1054889",
        title: `cannot reach printer P123123`,
        link: generator.detailUrl()
      },
      {
        id: "1054891",
        title: `Outlook crashes with error 0x43a4b227fd21`,
        link: generator.detailUrl()
      },
      {
        id: "1054878",
        title: `cannot open VPN connection`,
        link: generator.detailUrl()
      },
      {
        id: "1054880",
        title: `need password reset`,
        link: generator.detailUrl()
      },
      {
        id: "1054893",
        title: `cannot turn on monitor M31123`,
        link: generator.detailUrl()
      },
      {
        id: "1054874",
        title: `urgent: my iPhone was stolen`,
        link: generator.detailUrl()
      },
      {
        id: "1054875",
        title: `cannot open internet`,
        link: generator.detailUrl()
      },
      {
        id: "1054876",
        title: `login to SAP fails after 8pm`,
        link: generator.detailUrl()
      },
      {
        id: "1054877",
        title: `can I request a new laptop?`,
        link: generator.detailUrl()
      }
    ];

    let sortedItems = getItemsBasedOnDayOfTheYear(activity, items);

    var dateRange = $.dateRange(activity, "today");
    let filteredItems = filterItemsByDateRange(sortedItems, dateRange);

    const pagination = $.pagination(activity);
    let paginatedItems = paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;
    let value = activity.Response.Data.items.length;
    activity.Response.Data.title = T(activity, 'News Feed');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All News');
    activity.Response.Data.actionable = true;
    activity.Response.Data.value = value;
    activity.Response.Data.color = 'blue';
    activity.Response.Data.description = value > 1 ? T(activity, "You have {0} news.", value) : T(activity, "You have 1 news.");
  } catch (error) {
    $.handleError(activity, error);
  }
};
function getRandomMinutes() {
  return (Math.floor(Math.random() * 60) + 1);
}
//** returns new item[] reordered based on day of the year */
function getItemsBasedOnDayOfTheYear(activity, items) {
  let d = new Date();
  let timeslot1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0);
  let timeslot2 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 15, 0, 0);
  let userLocalTime = moment(d).tz(activity.Context.UserTimezone);

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let isTimeslot2 = null; // keeps track of which time to assign to news next (timeslot1 or timeslot2)

  if (userLocalTime.hours() >= 16) {
    isTimeslot2 = true;
  } else if (userLocalTime.hours() >= 10) {
    isTimeslot2 = false;
  } else {
    daysOffset = -1;
    isTimeslot2 = true;
  }

  let zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = zeroBasedDayInYear % items.length;

  let sortedItems = [];
  let newsCounter = 0; // used to count number of news in a day and help generate (date -1),...,(date -n).
  for (let i = 0; i < items.length; i++) {
    if (startIndex >= items.length) {
      startIndex = 0;
    }

    let timeToAssign = null;
    newsCounter++;
    if (isTimeslot2) {
      timeToAssign = new Date(timeslot2);
      if (newsCounter >= 2) { // keeps track of number of news and increases days offset when needed
        newsCounter = 0;
        daysOffset--;
      }
    } else {
      timeToAssign = new Date(timeslot1);
    }

    timeToAssign.setDate(timeToAssign.getDate() + daysOffset);
    timeToAssign.setMinutes(getRandomMinutes());
    isTimeslot2 = !isTimeslot2; // switch time to assign

    let newsDate = moment(timeToAssign).tz(activity.Context.UserTimezone);

    items[startIndex].date = newsDate.toLocaleString();
    sortedItems.push(items[startIndex]);
    startIndex++;
  }

  return sortedItems;
}
//** filters provided items[] based on provided daterange */
function filterItemsByDateRange(items, daterange) {
  let filteredItems = [];
  let start = new Date(daterange.startDate).valueOf();
  let end = new Date(daterange.endDate).valueOf();

  for (let i = 0; i < items.length; i++) {
    let tmpDate = new Date(items[i].date).valueOf();
    if (start < tmpDate && tmpDate < end) {
      filteredItems.push(items[i]);
    }
  }

  return filteredItems;
}
//** paginate items[] based on provided pagination */
function paginateItems(items, pagination) {
  let pagiantedItems = [];
  const pageSize = parseInt(pagination.pageSize);
  const offset = (parseInt(pagination.page) - 1) * pageSize;

  if (offset > items.length) return pagiantedItems;

  for (let i = offset; i < offset + pageSize; i++) {
    if (i >= items.length) {
      break;
    }
    pagiantedItems.push(items[i]);
  }
  return pagiantedItems;
}