'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    const items = [
      {
        id: '1054889',
        title: 'cannot reach printer P123123',
        link: generator.detailUrl()
      },
      {
        id: '1054891',
        title: 'Outlook crashes with error 0x43a4b227fd21',
        link: generator.detailUrl()
      },
      {
        id: '1054878',
        title: 'cannot open VPN connection',
        link: generator.detailUrl()
      },
      {
        id: '1054880',
        title: 'need password reset',
        link: generator.detailUrl()
      },
      {
        id: '1054893',
        title: 'cannot turn on monitor M31123',
        link: generator.detailUrl()
      },
      {
        id: '1054874',
        title: 'urgent: my iPhone was stolen',
        link: generator.detailUrl()
      },
      {
        id: '1054875',
        title: 'cannot open internet',
        link: generator.detailUrl()
      },
      {
        id: '1054876',
        title: 'login to SAP fails after 8pm',
        link: generator.detailUrl()
      },
      {
        id: '1054877',
        title: 'can I request a new laptop?',
        link: generator.detailUrl()
      }
    ];

    const sortedItems = getItemsBasedOnDayOfTheYear(activity, items);

    const dateRange = $.dateRange(activity);
    const filteredItems = shared.filterItemsByDateRange(sortedItems, dateRange);
    const value = filteredItems.length;

    const pagination = $.pagination(activity);
    const paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;
    activity.Response.Data.title = T(activity, 'Open Issues');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Issues');
    activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/github.svg';
    activity.Response.Data.actionable = value > 0;

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.date = shared.getHighestDate(paginatedItems);
      activity.Response.Data.description = value > 1 ? T(activity, 'There are {0} open issues.', value) : T(activity, 'There is 1 open issue.');
    } else {
      activity.Response.Data.description = T(activity, 'There are no open issues.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

const morningHour = 9;
const morningMinutes = 45;
const afternoonHour = 13;
const afternoonMinutes = 12;

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
