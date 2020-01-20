'use strict';

const md5 = require('md5');
const moment = require('moment-timezone');

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    const items = [
      {
        id: '32101',
        title: 'Mr. Marlon Schuppe',
        description: 'Maggio - Marks',
        thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/ssiskind/128.jpg',
        imageIsAvatar: true,
        link: generator.detailUrl()
      },
      {
        id: '32102',
        title: 'Cole Kirlin',
        description: 'Grady Inc',
        thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/herrhaase/128.jpg',
        imageIsAvatar: true,
        link: generator.detailUrl()
      },
      {
        id: '32103',
        title: 'Myrl Kovacek',
        description: 'David - Kuhlman',
        thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/vytautas_a/128.jpg',
        imageIsAvatar: true,
        link: generator.detailUrl()
      },
      {
        id: '32104',
        title: 'Haven Greenfelder',
        description: 'Williamson, Torp and Koepp',
        thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/macxim/128.jpg',
        imageIsAvatar: true,
        link: generator.detailUrl()
      },
      {
        id: '32105',
        title: 'Raphaelle Jaskolski',
        description: 'Hayes Inc',
        thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/aislinnkelly/128.jpg',
        imageIsAvatar: true,
        link: generator.detailUrl()
      },
      {
        id: '32106',
        title: 'Rebecca Collins',
        description: 'Stanton - Gusikowski',
        thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/rpatey/128.jpg',
        imageIsAvatar: true,
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

    // return explicit _hash
    activity.Response.Data._hash = md5(JSON.stringify(paginatedItems));
    activity.Response.Data.items = paginatedItems;
    activity.Response.Data.title = T(activity, 'Open Leads');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Leads');
    activity.Response.Data.actionable = value > 0;
    activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg';

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.date = shared.getHighestDate(items);
      activity.Response.Data.description = value > 1 ? T(activity, 'You have {0} open leads.', value) : T(activity, 'You have 1 open lead.');
      activity.Response.Data.briefing = activity.Response.Data.description + ' The latest is <b>' + activity.Response.Data.items[0].title + '</b>.';
    } else {
      activity.Response.Data.description = T(activity, 'You have no open leads.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

const morningHour = 9;
const morningMinutes = 36;
const afternoonHour = 14;
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
