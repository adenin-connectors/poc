'use strict';

const moment = require('moment-timezone');

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    const items = generator.ticketsList();
    const response = activity.Response.Data;

    const sortedItems = getItemsBasedOnDayOfTheYear(activity, items);

    let filteredItems = [];

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];

      if (item.statusText !== 'Open') continue;

      delete item.statusText;

      filteredItems.push(item);
    }

    const value = filteredItems.length;
    const dateRange = $.dateRange(activity);

    filteredItems = shared.filterItemsByDateRange(filteredItems, dateRange);

    const pagination = $.pagination(activity);
    const paginatedItems = shared.paginateItems(filteredItems, pagination);

    response.items = paginatedItems;
    response.title = T(activity, 'Open Tickets');
    response.link = generator.detailUrl();
    response.linkLabel = T(activity, 'All tickets');
    response.actionable = value > 0;

    response.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/freshdesk.svg'; // activity.Context.connector.host.connectorLogoUrl;

    if (value > 0) {
      response.value = value;
      response.date = shared.getHighestDate(paginatedItems);
      response.description = value > 1 ? T(activity, 'You have {0} open tickets assigned.', value) : T(activity, 'You have 1 open ticket assigned.');
      response.briefing = response.description + ' The latest is <b>' + response.items[0].title + '</b>';
    } else {
      response.description = T(activity, 'You have no open tickets assigned.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

const morningHour = 9;
const morningMinutes = 19;
const afternoonHour = 15;
const afternoonMinutes = 9;

//** returns new item[] reordered based on day of the year */
function getItemsBasedOnDayOfTheYear(activity, items) {
  const timeslot1 = moment().tz(activity.Context.UserTimezone).hours(morningHour).minutes(morningMinutes);
  const timeslot2 = moment().tz(activity.Context.UserTimezone).hours(afternoonHour).minutes(afternoonMinutes);

  const userLocalTime = moment().tz(activity.Context.UserTimezone);

  const d = new Date();

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

  const zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = zeroBasedDayInYear % items.length;

  if (isTimeslot2) startIndex++;

  const sortedItems = [];
  let counter = 0; // used to count number of news in a day and help generate (date -1),...,(date -n).

  for (let i = 0; i < items.length; i++) {
    if (startIndex >= items.length) startIndex = 0;
    else if (startIndex < 0) startIndex = items.length - 1;

    let timeToAssign = null;
    counter++;

    if (isTimeslot2) {
      timeToAssign = timeslot2.clone();

      if (counter >= 2) { // keeps track of number of news and increases days offset when needed
        counter = 0;
        daysOffset--;
      }
    } else {
      timeToAssign = timeslot1.clone();
    }

    timeToAssign.date(timeToAssign.date() + daysOffset);
    timeToAssign.startOf('minute');

    isTimeslot2 = !isTimeslot2; // switch time to assign

    const date = timeToAssign.clone().utc();

    items[startIndex].date = date.toISOString();

    sortedItems.push(items[startIndex]);
    startIndex++;
  }

  return sortedItems;
}
