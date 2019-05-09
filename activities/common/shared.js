'use strict';
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
  }
};
