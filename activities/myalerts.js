'use strict';

const moment = require('moment-timezone');

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    let items = [
      {
        id: '1054889',
        title: 'Elevator 3 currently out of order',
        link: generator.detailUrl()
      },
      {
        id: '1054878',
        title: 'ERP server unavailable until noon',
        link: generator.detailUrl()
      }
    ];

    items = assignDates(activity, items);

    const dateRange = $.dateRange(activity);
    const filteredItems = shared.filterItemsByDateRange(items, dateRange);
    const value = filteredItems.length;

    const pagination = $.pagination(activity);
    const paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;

    if (pagination.page === '1') {
      activity.Response.Data.title = T(activity, 'My Alerts');
      activity.Response.Data.link = generator.detailUrl();
      activity.Response.Data.linkLabel = T(activity, 'All Alerts');
      activity.Response.Data.actionable = value > 0;
      if (value > 0) {
        activity.Response.Data.value = value;
        activity.Response.Data.date = activity.Response.Data.items[0].date;
        activity.Response.Data.color = 'blue';
        activity.Response.Data.description = value > 1 ? T(activity, 'You have {0} alerts.', value) : T(activity, 'You have 1 alert.');
      } else {
        activity.Response.Data.description = T(activity, 'You have no alerts.');
      }
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

function assignDates(activity, items) {
  const d = new Date();

  const dayOfTheYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000);
  const userLocalTime = moment(d).tz(activity.Context.UserTimezone);

  const date = moment(userLocalTime);

  let isOddDay = false;

  if (dayOfTheYear % 2 !== 0) {
    isOddDay = true;
    date.add(1, 'day');
  }

  let counter = 0;
  let itemsProcessed = 0;

  while (itemsProcessed < items.length) {
    // if its before 8:39 we skip today
    // (date.date() == userLocalTime.date()) ensures that only today is skipped
    if ((userLocalTime.minutes() < 39 && userLocalTime.hours() < 8) && (date.date() == userLocalTime.date())) {
      date.add(1, 'day'); // we skip today

      isOddDay = !isOddDay; // since we are adding just one day we switch values
    } else if (!isOddDay) {
      date.add(1, 'day'); // if its not odd day we skip it

      isOddDay = true; // since we are adding 1 day, day becomes odd
    } else {
      const d = date.date();

      date.set('hour', 8);
      date.set('minute', d);

      items[itemsProcessed].date = date.toISOString();

      date.add(2, 'day'); // we are using only odd days so we add 2 to get next odd

      itemsProcessed++;
    }

    counter++;

    if (counter > 10) break;
  }

  return items;
}
