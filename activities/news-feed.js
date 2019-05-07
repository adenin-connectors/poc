'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');

module.exports = async (activity) => {
  try {
    let items = [
      {
        id: "1054889",
        title: `Grand Opening of a New Plant in China`,
        description: `description 0`,
        link: generator.detailUrl()
      },
      {
        id: "1054891",
        title: `Opening of new logistics and distribution center`,
        description: `description 1`,
        link: generator.detailUrl()
      },
      {
        id: "1054878",
        title: `New Wi-Fi enabled product line`,
        description: `description 2`,
        link: generator.detailUrl()
      },
      {
        id: "1054880",
        title: `Leading with passion, mistakes and simplicity`,
        description: `description 3`,
        link: generator.detailUrl()
      },
      {
        id: "1054893",
        title: `Multi-Year Agreement signed`,
        description: `description 4`,
        link: generator.detailUrl()
      }
    ];

    activity.Response.Data.items = getItemsBasedOnDayOfTheYear(activity, items);
    let value = activity.Response.Data.items.length;
    activity.Response.Data.title = T(activity, 'News Feed');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All News');
    activity.Response.Data.actionable = true;
    activity.Response.Data.value = value;
    activity.Response.Data.color = 'blue';
    activity.Response.Data.description = value > 1 ? T(activity, "You have {0} news.", value) : T(activity, "You have 1 news.");
  } catch (error) {
    $.handleError(activity, error);
  }
};

function getRandomMinutes() {
  return (Math.floor(Math.random() * 60) + 1);
}

//** returns new item[] reordered based on day of the year */
function getItemsBasedOnDayOfTheYear(activity, items) {
  let d = new Date();
  let _8AMtime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, 0, 0);
  let _2PMtime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 14, 0, 0);

  let userLocalTime = moment(d)
    .tz(activity.Context.UserTimezone);

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let is2PMtime = null; // keeps track of which time to assign to news next (8am or 2pm)
  if (userLocalTime.hours() >= 16) {
    is2PMtime = true;
  } else if (userLocalTime.hours() >= 10) {
    is2PMtime = false;
  } else {
    daysOffset = -1;
    is2PMtime = true;
  }

  let zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = zeroBasedDayInYear % items.length;

  let sortedItems = [];
  let daysCounter = 0; // used to count number of news in a day and help generate (date -1),...,(date -n).
  for (let i = 0; i < items.length; i++) {
    if (startIndex >= items.length) {
      startIndex = 0;
    }
    let timeToAssign = null;
    daysCounter++;
    if (is2PMtime) {
      timeToAssign = new Date(_2PMtime);
      if (daysCounter >= 2) { // keeps track of number of news and increases days offset when needed
        daysCounter = 0;
        daysOffset--;
      }
    } else {
      timeToAssign = new Date(_8AMtime);
    }

    timeToAssign.setDate(timeToAssign.getDate() + daysOffset);
    timeToAssign.setMinutes(getRandomMinutes());
    is2PMtime = !is2PMtime; // switch next time to assign

    let newsDate = moment(timeToAssign)
      .tz(activity.Context.UserTimezone);

    items[startIndex].date = newsDate.toISOString();
    sortedItems.push(items[startIndex]);
    startIndex++;

  }
  return sortedItems;
}
