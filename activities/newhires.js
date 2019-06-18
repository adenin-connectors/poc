'use strict';
const api = require('./common/hrapi');

module.exports = async (activity) => {
  try {
    const pagination = $.pagination(activity);

    let url = '/?seed=adenin';
    url += '&page=' + pagination.page;
    url += '&results=' + pagination.pageSize;
    url += '&inc=name,email,location,picture';

    api.initialize(activity);

    const response = await api(url);

    if ($.isErrorResponse(activity, response)) return;

    const items = response.body.results;

    for (let i = 0; i < items.length; i++) {
      const item = convertItem(items[i]);

      activity.Response.Data.items.push(item);
    }
  } catch (error) {
    // handle generic exception
    $.handleError(activity, error);
  }

  function convertItem(_item) {
    const item = {};

    // *todo* convert item as needed
    let id = _item.picture.large;

    id = id.substring(id.lastIndexOf('/') + 1); // extract id from image name
    item.id = id.substring(0, id.indexOf('.'));
    item.title = _item.name.first + ' ' + _item.name.last;
    item.description = _item.email;
    item.picture = _item.picture.large;

    return item;
  }
};