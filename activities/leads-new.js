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

    let count = 0;
    let readDate = (new Date(new Date().setDate(new Date().getDate() - 30))).toISOString(); // default read date 30 days in the past

    if (activity.Request.Query.readDate) readDate = activity.Request.Query.readDate;

    for (let i = 0; i < filteredItems.length; i++) {
      if (filteredItems[i].date > readDate) {
        filteredItems[i].isNew = true;
        count++;
      }
    }

    const pagination = $.pagination(activity);
    const paginatedItems = shared.paginateItems(filteredItems, pagination);

    // return explicit _hash
    activity.Response.Data._hash = md5(JSON.stringify(paginatedItems));
    activity.Response.Data.items = paginatedItems;
    activity.Response.Data.title = T(activity, 'New Leads');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Leads');
    activity.Response.Data.actionable = count > 0;
    activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg';

    if (count > 0) {
      activity.Response.Data.value = count;
      activity.Response.Data.date = paginatedItems[0].date;
      activity.Response.Data.description = count > 1 ? T(activity, 'You have {0} new leads.', count) : T(activity, 'You have 1 new lead.');
      activity.Response.Data.briefing = activity.Response.Data.description + ' The latest is <b>' + activity.Response.Data.items[0].title + '</b>.';
    } else {
      activity.Response.Data.description = T(activity, 'You have no new leads.');
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

  for (let i = 0; i < items.length; i++) {
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

    if (i < 2) {
      items[startIndex].statusText = 'Open';
    } else {
      items[startIndex].statusText = 'Closed';
    }

    sortedItems.push(items[startIndex]);

    startIndex++;
    indexShift--;

    if (indexShift < 0) indexShift = 5;
  }

  return sortedItems;
}
