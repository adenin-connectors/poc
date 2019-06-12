'use strict';
const generator = require('./common/generator');
const faker = require('faker');

module.exports = async function (activity) {
  try {
    let servers = [
      {
        _type: "server-status",
        id: faker.random.uuid(),
        title: `Mars`,
        description: 'Down',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      },
      {
        _type: "server-status",
        id: faker.random.uuid(),
        title: `Jupiter`,
        description: 'Down',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      },
      {
        _type: "server-status",
        id: faker.random.uuid(),
        title: `Saturn`,
        description: 'Down',
        date: new Date().toISOString(),
        link: generator.detailUrl()
      }
    ];

    let serverIndex = new Date().getHours() % 4;

    let serversDown = [];
    if (serverIndex < servers.length) {
      serversDown.push(servers[serverIndex]);
    }

    let value = serversDown.length;

    activity.Response.Data.items = serversDown;
    activity.Response.Data.title = T(activity, 'Servers Down');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Servers That Are Down');
    activity.Response.Data.actionable = value > 0;

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.color = 'blue';
      activity.Response.Data.description = value > 1 ? T(activity, "{0} servers are currently down.", value)
        : T(activity, "1 server is currently down.");
    } else {
      activity.Response.Data.description = T(activity, 'All servers are running.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};