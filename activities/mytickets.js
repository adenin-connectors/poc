'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');
const shared = require('./common/shared');

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
    let filteredItems = shared.filterItemsByDateRange(sortedItems, dateRange);
    let value = filteredItems.length;

    const pagination = $.pagination(activity);
    let paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;
    activity.Response.Data.title = T(activity, 'Open Tickets');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All tickets');
    activity.Response.Data.actionable = value > 0;
    
    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.date = shared.getHighestDate(paginatedItems);
      activity.Response.Data.color = 'blue';
      activity.Response.Data.description = value > 1 ? T(activity, "You have {0} tickets assigned.", value) : T(activity, "You have 1 ticket assigned.");
    } else {
      activity.Response.Data.description = T(activity, `You have no tickets assigned.`);
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};
//** returns new item[] reordered based on day of the year */
function getItemsBasedOnDayOfTheYear(activity, items) {
  let morningHour = 9;
  let afternoonHour = 15;
  let timeslot1 = new Date();
  timeslot1.setHours(morningHour);
  let timeslot2 = new Date();
  timeslot2.setHours(afternoonHour);

  let d = new Date();
  let userLocalTime = moment(d).tz(activity.Context.UserTimezone);

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let isTimeslot2 = null; // keeps track of which time to assign to news next (timeslot1 or timeslot2)

  if (userLocalTime.hours() >= (afternoonHour + 1)) {
    isTimeslot2 = true;
  } else if (userLocalTime.hours() >= (morningHour + 1)) {
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
    timeToAssign.setMinutes(shared.getRandomInt(60));
    isTimeslot2 = !isTimeslot2; // switch time to assign

    let itemDate = moment(timeToAssign).tz(activity.Context.UserTimezone);

    items[startIndex].date = itemDate.toISOString();
    sortedItems.push(items[startIndex]);
    startIndex++;
  }

  return sortedItems;
}