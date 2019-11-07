'use strict';

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async function (activity) {
  try {
    const servers = [
      {
        _type: 'server-status',
        id: 'Mars',
        link: generator.detailUrl()
      },
      {
        _type: 'server-status',
        id: 'Jupiter',
        link: generator.detailUrl()
      },
      {
        _type: 'server-status',
        id: 'Saturn',
        link: generator.detailUrl()
      }
    ];

    // N = 3 servers
    const N = servers.length;
    // d = 4 minutes (240000ms)
    const d = 240000;
    // interval for t0 change (2^N)*d
    const interval = (Math.pow(2, N)) * d;
    // current ms since epoch
    const now = new Date().getTime();
    // t0
    const t0 = now - (now % interval);
    // mins since t0
    const diff = new Date(now - t0);
    // minutes since t0 as N-character binary string e.g. 2 mins -> '010'
    const statuses = (diff.getUTCMinutes() >>> 0).toString(2).padStart(N, '0');
    // store down servers here for count and description
    const serversDown = [];

    for (let n = 0; n < N; n++) {
      // binary 1 == down. set the matching server as down
      if (statuses.charAt(n) === '1') {
        servers[n].title = servers[n].id + ': down';
        // time stamp of down server == ((n+1) * d * 3) milliseconds before t0
        servers[n].date = new Date(t0 - ((n + 1) * d * 3));
        servers[n].color = 'red';

        serversDown.push(servers[n]);

        continue;
      }

      // else set server to up, timestamp is t0
      servers[n].title = servers[n].id + ': up';
      servers[n].date = new Date(t0);
      servers[n].color = 'green';
    }

    const response = activity.Response.Data;

    response.items = servers;
    response.title = T(activity, 'Server Status');
    response.link = generator.detailUrl();
    response.linkLabel = T(activity, 'DevOps Dashboard');
    response.actionable = serversDown.length > 0;

    response.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/freshping.svg';

    if (serversDown.length > 0) {
      response.description = serversDown.length > 1 ? T(activity, '{0} servers are currently down.', serversDown.length) : T(activity, '1 server is currently down.');
      response.value = serversDown.length;
      response.date = shared.getHighestDate(servers);
      response.color = 'red';

      switch (serversDown.length) {
      case 1:
        response.briefing = T(activity, `Server <b>${serversDown[0].id}</b> is currently down.`);
        break;
      case 2:
        response.briefing = T(activity, `Servers <b>${serversDown[0].id}</b> and <b>${serversDown[1].id}</b> are currently down.`);
        break;
      default:
        response.briefing = T(activity, `Server <b>${serversDown[0].id}</b> and <b>${serversDown.length - 1}</b> more are currently down.`);
      }
    } else {
      response.description = T(activity, 'All servers are running.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};
