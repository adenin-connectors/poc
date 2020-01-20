'use strict';

const md5 = require('md5');

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

    const pagination = $.pagination(activity);

    const value = items.length;
    const dateRange = $.dateRange(activity);

    const filteredItems = shared.filterItemsByDateRange(items, dateRange);
    const paginatedItems = shared.paginateItems(filteredItems, pagination);

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
