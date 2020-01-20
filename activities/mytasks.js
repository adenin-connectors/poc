'use strict';

const moment = require('moment-timezone');

const generator = require('./common/generator');
const shared = require('./common/shared');

const d = new Date();

module.exports = async (activity) => {
  try {
    const items = [
      {
        id: '1054889',
        title: `Budget Planning ${d.getFullYear() + 1}`,
        link: generator.detailUrl()
      },
      {
        id: '1054891',
        title: 'Project \'Sunderland\' kick off',
        link: generator.detailUrl()
      },
      {
        id: '1054878',
        title: 'Job Interview Hattie Mitchell',
        link: generator.detailUrl()
      },
      {
        id: '1054880',
        title: 'Job Interview Tod Runte',
        link: generator.detailUrl()
      },
      {
        id: '1054893',
        title: `Service Status ${new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()).toLocaleString('en', {month: 'long'})}`,
        link: generator.detailUrl()
      }
    ];

    const sortedItems = sortItemsBasedOnDayOfTheYear(activity, items);

    const dateRange = $.dateRange(activity);
    const filteredItems = shared.filterItemsByDateRange(sortedItems, dateRange);
    const value = filteredItems.length;

    const pagination = $.pagination(activity);
    const paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;
    activity.Response.Data.title = T(activity, 'My Tasks');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Tasks');
    activity.Response.Data.actionable = value > 0;

    activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/exchange-server.svg';

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.date = shared.getHighestDate(paginatedItems);
      activity.Response.Data.description = value > 1 ? T(activity, 'You have {0} tasks.', value) : T(activity, 'You have 1 task.');
      activity.Response.Data.briefing = activity.Response.Data.description + ' The latest is <b>' + activity.Response.Data.items[0].title + '</b>.';
    } else {
      activity.Response.Data.description = T(activity, 'You have no tasks.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

const morningHour = 10;
const morningMinutes = 4;
const afternoonHour = 12;
const afternoonMinutes = 56;

//** returns new item[] reordered based on day of the year */
function sortItemsBasedOnDayOfTheYear(activity, items) {
  const timeslot1 = moment().tz(activity.Context.UserTimezone).hours(morningHour).minutes(morningMinutes);
  const timeslot2 = moment().tz(activity.Context.UserTimezone).hours(afternoonHour).minutes(afternoonMinutes);

  const userLocalTime = moment().tz(activity.Context.UserTimezone);

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let isTimeslot2 = null; // keeps track of which time to assign next (timeslot1 or timeslot2)

  if (userLocalTime.isAfter(timeslot1) && userLocalTime.isBefore(timeslot2)) {
    isTimeslot2 = true;
  } else if (userLocalTime.isAfter(timeslot2)) {
    isTimeslot2 = false;
    daysOffset = 1;
  } else {
    isTimeslot2 = false;
  }

  const d = new Date();

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
    } else {
      timeToAssign = timeslot1.clone();

      if (counter >= 2) { // keeps track of number of news and increases days offset when needed
        counter = 0;
        daysOffset++;
      }
    }

    timeToAssign.date(timeToAssign.date() + daysOffset);
    timeToAssign.startOf('minutes');

    isTimeslot2 = !isTimeslot2; // switch time to assign

    const date = timeToAssign.clone().utc();

    items[startIndex].date = date.toISOString();

    sortedItems.push(items[startIndex]);
    startIndex++;
  }

  return sortedItems;
}
