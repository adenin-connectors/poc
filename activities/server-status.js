'use strict';

const faker = require('faker');
const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async function (activity) {
  try {
    const servers = [
      {
        _type: 'server-status',
        id: faker.random.uuid(),
        title: 'Mars',
        description: faker.random.boolean() ? 'Down.' : 'Up.',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      },
      {
        _type: 'server-status',
        id: faker.random.uuid(),
        title: 'Jupiter',
        description: faker.random.boolean() ? 'Down.' : 'Up.',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      },
      {
        _type: 'server-status',
        id: faker.random.uuid(),
        title: 'Saturn',
        description: faker.random.boolean() ? 'Down.' : 'Up.',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      }
    ];

    let downCount = 0;

    for (let i = 0; i < servers.length; i++) {
      if (servers[i].description === 'Down.') downCount++;
    }

    activity.Response.Data.items = servers;
    activity.Response.Data.title = T(activity, 'Server Status');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All server statuses');
    activity.Response.Data.actionable = downCount > 0;

    activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/freshping.svg';

    if (downCount > 0) {
      activity.Response.Data.value = downCount;
      activity.Response.Data.date = shared.getHighestDate(servers);
      activity.Response.Data.color = 'blue';
      activity.Response.Data.description = downCount > 1 ?
        T(activity, `Server <b>'${activity.Response.Data.items[0]}'</b> and <b>${downCount - 1}</b> more are currently down.`) :
        T(activity, `Server <b>'${activity.Response.Data.items[0]}'</b> is currently down.`);
    } else {
      activity.Response.Data.description = T(activity, 'All servers are running.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};
