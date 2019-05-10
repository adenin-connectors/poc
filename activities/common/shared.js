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
    let morningHour = 7;
    let afternoonHour = 17;
    let timeslot1 = new Date();
    timeslot1.setHours(morningHour);
    let timeslot2 = new Date();
    timeslot2.setHours(afternoonHour);

    let startIndex = Math.floor((new Date().getUTCHours() % 12) / 2);

    let daysOffset = 0;
    let minsDiff = -90;
    let sortedItems = [];

    let date = new Date();

    for (let i = 0; i < items.length; i++) {
      if (startIndex >= items.length) {
        startIndex = 0;
      }
      // first is now - 0 to 45 min, second now -90 mins - 0 to 45 mins, third now -180 - 0 to 45 mins 
      date.setMinutes(date.getMinutes() + (i == 0 ? 0 : minsDiff) + this.getRandomInt(minsDiff / 2));

      if (date.getHours() < 9) {
        daysOffset--;
        date.setDate(date.getDate() + daysOffset);
        date.setHours(timeslot2.getHours() - (timeslot1.getHours() - date.getHours()));
        if (date.getHours() >= 17) {
          date.setHours(16);
        }
      }

      let itemDate = moment(date).tz(activity.Context.UserTimezone);

      items[startIndex].date = itemDate.toISOString();
      sortedItems.push(items[startIndex]);
      startIndex++;
    }

    return sortedItems;
  }
};

