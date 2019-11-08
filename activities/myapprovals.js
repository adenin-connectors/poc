'use strict';

const moment = require('moment-timezone');

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    const action = $.getObjPath(activity.Request, 'Path');

    if (action === 'approve' || action === 'decline') {
      activity.Response.Data = {
        success: true
      };

      return;
    }

    const items = [
      {
        id: '1054889',
        title: 'PTO Request',
        description: 'James Cook, 8 hours',
        link: generator.detailUrl()
      },
      {
        id: '1054891',
        title: 'Purchase Request',
        description: 'Apple MacBook Pro 15, US$ 2.400',
        link: generator.detailUrl()
      },
      {
        id: '1054878',
        title: 'Feedback',
        link: generator.detailUrl()
      },
      {
        id: '1054880',
        title: 'Requirement to hire',
        description: 'Key Account Manager  for region: east 2',
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
    activity.Response.Data.title = T(activity, 'My Approvals');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Approvals');
    activity.Response.Data.actionable = value > 0;

    activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/sap.svg';

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.date = shared.getHighestDate(paginatedItems);
      activity.Response.Data.description = value > 1 ? T(activity, 'You have {0} approvals.', value) : T(activity, 'You have 1 approval.');
      activity.Response.Data.briefing = activity.Response.Data.description + ' The latest is <b>' + activity.Response.Data.items[0].title + '</b>.';
    } else {
      activity.Response.Data.description = T(activity, 'You have no approvals.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

const morningHour = 11;
const morningMinutes = 12;
const afternoonHour = 13;
const afternoonMinutes = 21;

//** returns new item[] reordered based on day of the year */
function getItemsBasedOnDayOfTheYear(activity, items) {
  const timeslot1 = moment().tz(activity.Context.UserTimezone).hours(morningHour).minutes(morningMinutes);
  const timeslot2 = moment().tz(activity.Context.UserTimezone).hours(afternoonHour).minutes(afternoonMinutes);

  const userLocalTime = moment().tz(activity.Context.UserTimezone);

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let isTimeslot2 = null; // keeps track of which time to assign to news next (timeslot1 or timeslot2)

  if (userLocalTime.isAfter(timeslot2)) {
    isTimeslot2 = true;
  } else if (userLocalTime.isAfter(timeslot1)) {
    isTimeslot2 = false;
  } else {
    daysOffset = -1;
    isTimeslot2 = true;
  }

  const d = new Date();

  const zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = zeroBasedDayInYear % items.length;

  if (isTimeslot2) startIndex--;

  const sortedItems = [];
  let counter = 0; // used to count number of news in a day and help generate (date -1),...,(date -n).

  for (let i = 0; i < items.length; i++) {
    if (startIndex >= items.length) startIndex = 0;

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
