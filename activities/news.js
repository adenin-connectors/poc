'use strict';
const generator = require('./common/generator');

module.exports = async (activity) => {
  try {
    activity.Response.Data.items = getItemsBasedOnCurrentTime();
    activity.Response.Data.title = T(activity, 'News');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All News');
  } catch (error) {
    $.handleError(activity, error);
  }
};

function getRandomMinutes(date) {
  return date.getMinutes() + (Math.floor(Math.random() * 92) + 1);
}

//** checks current time of the day to decide how many items we need */
function getItemsBasedOnCurrentTime() {
  let d = new Date();
  if (d.getHours() > 14) {
    return getItemsBasedOnDayOfTheYear(4);
  } else if (d.getHours() > 8) {
    return getItemsBasedOnDayOfTheYear(3);
  } else {
    return getItemsBasedOnDayOfTheYear(2);
  }
}
//** returns new item[] reordered based on day of the year */
function getItemsBasedOnDayOfTheYear(noOfItems) {
  let zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = (zeroBasedDayInYear % items.length);

  let sortedItems = [];
  let itemCounter = 0;
  for (let i = 0; i < noOfItems; i++) {
    if (startIndex >= items.length) {
      startIndex = 0;
    }
    // set dates to yesterday for first 2 items
    if (itemCounter < 2) {
      itemCounter++;
      let tmpDate = new Date(items[startIndex].date);
      items[startIndex].date = new Date(tmpDate.setDate(tmpDate.getDate() - 1)).toISOString();
    }
    sortedItems.push(items[startIndex]);
    startIndex++;
  }
  return sortedItems;
}
let d = new Date();
let items = [
  {
    id: "1054889",
    title: `Grand Opening of a New Plant in China`,
    description: `description 0`,
    link: generator.detailUrl(),
    date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 14, getRandomMinutes(d), 0).toISOString()
  },
  {
    id: "1054891",
    title: `Opening of new logistics and distribution center`,
    description: `description 1`,
    link: generator.detailUrl(),
    date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, getRandomMinutes(d), 0).toISOString()
  },
  {
    id: "1054878",
    title: `New Wi-Fi enabled product line`,
    description: `description 2`,
    link: generator.detailUrl(),
    date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 14, getRandomMinutes(d), 0).toISOString()
  },
  {
    id: "1054880",
    title: `Leading with passion, mistakes and simplicity`,
    description: `description 3`,
    link: generator.detailUrl(),
    date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, getRandomMinutes(d), 0).toISOString()
  },
  {
    id: "1054893",
    title: `Multi-Year Agreement signed`,
    description: `description 4`,
    link: generator.detailUrl(),
    date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 14, getRandomMinutes(d), 0).toISOString()
  }
];