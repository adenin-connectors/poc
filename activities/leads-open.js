'use strict';

const md5 = require('md5');
const moment = require('moment-timezone');

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    const items = generator.leadsList();
    const sortedItems = sortItemsBasedOnTimeOfDay(activity, items);

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

function sortItemsBasedOnTimeOfDay(activity, items) {
  const userLocalTime = moment().tz(activity.Context.UserTimezone);

  const slot1 = userLocalTime.clone().hours(9).minutes(30).startOf('minute');
  const slot2 = userLocalTime.clone().hours(11).startOf('hour');
  const slot3 = userLocalTime.clone().hours(12).minutes(30).startOf('minute');
  const slot4 = userLocalTime.clone().hours(14).startOf('hour');
  const slot5 = userLocalTime.clone().hours(15).minutes(30).startOf('minute');
  const slot6 = userLocalTime.clone().hours(17).startOf('hour');

  let indexShift = 0;
  let daysOffset = 0;

  if (userLocalTime.isSameOrAfter(slot1) && userLocalTime.isBefore(slot2)) {
    indexShift = 1;
  } else if (userLocalTime.isBefore(slot3)) {
    indexShift = 2;
  } else if (userLocalTime.isBefore(slot4)) {
    indexShift = 3;
  } else if (userLocalTime.isBefore(slot5)) {
    indexShift = 4;
  } else if (userLocalTime.isBefore(slot6)) {
    indexShift = 5;
  } else if (userLocalTime.isSameOrAfter(slot6)) {
    indexShift = 6;
  }

  const d = new Date();

  const zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = (zeroBasedDayInYear % items.length) + indexShift;

  const sortedItems = [];

  for (let i = 0; i < items.length && i < 2; i++) {
    if (startIndex >= items.length) startIndex = 0;
    else if (startIndex < 0) startIndex = items.length - 1;

    let timeToAssign = null;

    switch (indexShift) {
    case 1:
      timeToAssign = slot1.clone();
      break;
    case 2:
      timeToAssign = slot2.clone();
      break;
    case 3:
      timeToAssign = slot3.clone();
      break;
    case 4:
      timeToAssign = slot4.clone();
      break;
    case 5:
      timeToAssign = slot5.clone();
      break;
    case 6:
      timeToAssign = slot6.clone();
      break;
    default:
      daysOffset--;
      timeToAssign = slot6.clone();
      break;
    }

    timeToAssign.date(timeToAssign.date() + daysOffset).startOf('minute');

    const date = timeToAssign.clone().utc();

    items[startIndex].date = date.toISOString();

    sortedItems.push(items[startIndex]);

    startIndex++;
    indexShift--;

    if (indexShift < 0) indexShift = 5;
  }

  return sortedItems;
}
