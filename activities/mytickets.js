'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    let items = [
      {
        id: "1054889",
        title: `Damaged product, could I have a refund?`,
        link: generator.detailUrl()
      },
      {
        id: "1054891",
        title: `When will I receive my order?`,
        link: generator.detailUrl()
      },
      {
        id: "1054878",
        title: `Cannot finish checkout process.`,
        link: generator.detailUrl()
      },
      {
        id: "1054880",
        title: `Locked out of my account, no access to email.`,
        link: generator.detailUrl()
      },
      {
        id: "1054893",
        title: `Request product exchange.`,
        link: generator.detailUrl()
      },
      {
        id: "1054874",
        title: `Card has been charged twice.`,
        link: generator.detailUrl()
      },
      {
        id: "1054875",
        title: `My coupon does not work.`,
        link: generator.detailUrl()
      },
      {
        id: "1054876",
        title: `Account is suspended?`,
        link: generator.detailUrl()
      },
      {
        id: "1054877",
        title: `Want more info about this product.`,
        link: generator.detailUrl()
      }
    ];

    let response = activity.Response.Data;
    let sortedItems = getItemsBasedOnDayOfTheYear(activity, items);
    var dateRange = $.dateRange(activity);
    let filteredItems = shared.filterItemsByDateRange(sortedItems, dateRange);
    let value = filteredItems.length;

    const pagination = $.pagination(activity);
    let paginatedItems = shared.paginateItems(filteredItems, pagination);

    response.items = paginatedItems;
    response.title = T(activity, 'Open Tickets');
    response.link = generator.detailUrl();
    response.linkLabel = T(activity, 'All tickets');
    response.actionable = value > 0;

    response.thumbnail = "https://www.adenin.com/assets/images/wp-images/logo/freshdesk.svg"; // activity.Context.connector.host.connectorLogoUrl;

    if (value > 0) {
      response.value = value;
      response.date = shared.getHighestDate(paginatedItems);
      response.description = value > 1 ? T(activity, "You have {0} tickets assigned.", value) : T(activity, "You have 1 ticket assigned.");
      response.briefing =  response.description + " The latest is <b>" + response.items[0].title + "</b>";
    } else {
      response.description = T(activity, `You have no tickets assigned.`);
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