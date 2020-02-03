'use strict';

const moment = require('moment-timezone');

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    let items = [
      {
        id: '1054889',
        title: 'Parking B closed tomorrow',
        link: generator.detailUrl()
      },
      {
        id: '1054878',
        title: 'blood donation in lobby next Monday',
        link: generator.detailUrl()
      }
    ];

    items = sortItemsBasedOnDayOfTheYear(activity, items);

    const dateRange = $.dateRange(activity);
    const filteredItems = shared.filterItemsByDateRange(items, dateRange);
    const value = filteredItems.length;

    const pagination = $.pagination(activity);
    const paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/sharepoint-online.svg';

    activity.Response.Data.items = paginatedItems;

    if (pagination.page === '1') {
      activity.Response.Data.title = T(activity, 'My Announcements');
      activity.Response.Data.link = generator.detailUrl();
      activity.Response.Data.linkLabel = T(activity, 'All Announcements');
      activity.Response.Data.actionable = value > 0;

      if (value > 0) {
        activity.Response.Data.value = value;
        activity.Response.Data.date = activity.Response.Data.items[0].date;
        activity.Response.Data.description = value > 1 ? T(activity, 'You have {0} announcements.', value) : T(activity, 'You have 1 announcement.');
        activity.Response.Data.briefing = activity.Response.Data.description + ' The latest is <b>' + activity.Response.Data.items[0].title + '</b>.';
      } else {
        activity.Response.Data.description = T(activity, 'You have no announcements.');
      }
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

const morningHour = 11;
const morningMinutes = 52;
const afternoonHour = 16;
const afternoonMinutes = 12;

//** returns new item[] reordered based on day of the year */
function sortItemsBasedOnDayOfTheYear(activity, items) {
  const timeslot1 = moment().tz(activity.Context.UserTimezone).hours(morningHour).minutes(morningMinutes);
  const timeslot2 = moment().tz(activity.Context.UserTimezone).hours(afternoonHour).minutes(afternoonMinutes);

  const userLocalTime = moment().tz(activity.Context.UserTimezone);

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let isTimeslot2 = null; // keeps track of which time to assign next (timeslot1 or timeslot2)

  if (userLocalTime.isBefore(timeslot1)) {
    isTimeslot2 = true;
    daysOffset--;
  } else if (userLocalTime.isAfter(timeslot2)) {
    isTimeslot2 = true;
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
        daysOffset--;
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
