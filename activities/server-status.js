'use strict';

const faker = require('faker');
const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async function (activity) {
  try {
    const down = [faker.random.boolean(), faker.random.boolean(), faker.random.boolean()];
    const servers = [
      {
        _type: 'server-status',
        id: 'Mars',
        title: 'Mars: ' + (down[0] ? 'down' : 'up'),
        color: down[0] ? 'red' : 'green',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      },
      {
        _type: 'server-status',
        id: 'Jupiter',
        title: 'Jupiter: ' + (down[1] ? 'down' : 'up'),
        color: down[1] ? 'red' : 'green',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      },
      {
        _type: 'server-status',
        id: 'Saturn',
        title: 'Saturn: ' + (down[2] ? 'down' : 'up'),
        color: down[2] ? 'red' : 'green',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      }
    ];

    const serversDown = [];

    for (let i = 0; i < servers.length; i++) {
      if (down[i]) serversDown.push(servers[i]);
    }

    const downCount = serversDown.length;
    const response = activity.Response.Data;

    response.items = servers;
    response.title = T(activity, 'Server Status');
    response.link = generator.detailUrl();
    response.linkLabel = T(activity, 'DevOps Dashboard');
    response.actionable = downCount > 0;

    response.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/freshping.svg';

    if (downCount > 0) {
      response.description = downCount > 1 ?
        T(activity, '{0} servers are currently down.', downCount) :
        T(activity, '1 server is currently down.');

      response.value = downCount;
      response.date = shared.getHighestDate(servers);
      response.color = 'red';

      switch (downCount) {
      case 1:
        response.briefing = T(activity, `Down: <b>${serversDown[0].id}</b>.`);
        break;
      case 2:
        response.briefing = T(activity, `Down: <b>${serversDown[0].id}</b> and <b>${serversDown[1].id}</b>.`);
        break;
      default:
        response.briefing = T(activity, `Down: <b>${serversDown[0].id}</b> and <b>${downCount - 1}</b> more.`);
      }
    } else {
      response.description = T(activity, 'All servers are running.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};
