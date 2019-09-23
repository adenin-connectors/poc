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

    const response = activity.Response.Data;

    response.items = servers;
    response.title = T(activity, 'Server Status');
    response.link = generator.detailUrl();
    response.linkLabel = T(activity, 'All server statuses');
    response.actionable = downCount > 0;

    response.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/freshping.svg';

    if (downCount > 0) {

      response.description = downCount > 1 ? T(activity, '{0} servers are currently down.', downCount) : T(activity, '1 server is currently down.');

      response.value = downCount;
      response.date = shared.getHighestDate(servers);
      response.color = 'red';

      switch (downCount) {
        case 1:
          response.briefing = T(activity, `Server <b>${response.items[0].title}</b> is currently down.`);
          break;
        case 2:
          response.briefing = T(activity, `Server <b>${response.items[0].title}</b> and <b>${downCount - 1}</b> more are currently down.`);
          break;
        default:
          response.briefing = T(activity, `Server <b>${response.items[0].title}</b>, <b>${response.items[1].title}</b> and <b>${downCount - 2}</b> more are currently down.`);
      }
    } else {
      response.description = T(activity, 'All servers are running.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};
