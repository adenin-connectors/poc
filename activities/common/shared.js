'use strict';
const moment = require('moment-timezone');

module.exports = {
  getRandomInt: function (max) {
    return (Math.floor(Math.random() * max) + 1);
  },
  //** filters provided items[] based on provided daterange */
  filterItemsByDateRange: function (items, daterange) {
    let filteredItems = [];
    let start = new Date(daterange.startDate).valueOf();
    let end = new Date(daterange.endDate).valueOf();

    for (let i = 0; i < items.length; i++) {
      let tmpDate = new Date(items[i].date).valueOf();
      if (start < tmpDate && tmpDate < end) {
        filteredItems.push(items[i]);
      }
    }

    return filteredItems;
  },
  //** paginate items[] based on provided pagination */
  paginateItems: function (items, pagination) {
    let pagiantedItems = [];
    const pageSize = parseInt(pagination.pageSize);
    const offset = (parseInt(pagination.page) - 1) * pageSize;

    if (offset > items.length) return pagiantedItems;

    for (let i = offset; i < offset + pageSize; i++) {
      if (i >= items.length) {
        break;
      }
      pagiantedItems.push(items[i]);
    }
    return pagiantedItems;
  },
  //** returns new item[] reordered based on UTC hour of the day */
  getItemsBasedOnHour: function (activity, items) {
    let timeslot1 = moment().tz(activity.Context.UserTimezone);
    timeslot1.set({ hour: 9 });
    let timeslot2 = moment().tz(activity.Context.UserTimezone);
    timeslot2.set({ hour: 17 });

    let minsDiff = -90;
    let sortedItems = [];

    let startIndex = Math.floor((new Date().getUTCHours() % 12) / 2);
    let date = moment().tz(activity.Context.UserTimezone);

    for (let i = 0; i < items.length; i++) {
      if (startIndex >= items.length) startIndex = 0;

      if (date.hours() >= timeslot2.hours()) date.set({ hour: timeslot2.hours(), minute: 0 });

      date.set({ minute: (date.minutes() + (i == 0 ? 0 : minsDiff) + this.getRandomInt(minsDiff / 2)) });

      if (date.hours() < timeslot1.hours()) date.set({ date: date.date() - 1, hour: timeslot2.hours(), minute: this.getRandomInt(minsDiff / 2) });

      items[startIndex].date = date.toISOString();
      sortedItems.push(items[startIndex]);
      startIndex++;
    }

    return sortedItems;
  },
  //** get higest date */
  getHighestDate: function (items) {
    let highestDate = 0;

    for (let i = 0; i < items.length; i++) {
      let nextDate = Date.parse(items[i].date);

      if (nextDate > highestDate) {
        highestDate = nextDate;
      }
    }

    return new Date(highestDate).toISOString();
  }
};

