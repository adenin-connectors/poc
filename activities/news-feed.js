'use strict';

const generator = require("./common/generator");
const moment = require("moment-timezone");
const shared = require("./common/shared");

module.exports = async (activity) => {
  try {
    let items = [
      {
        id: "1054889",
        title: "Grand Opening of a New Plant in China",
        link: generator.detailUrl(),
        thumbnail: "https://my.digitalassistant.app/rimage/demo.adenin.com/images/t0001054889/tp1000126.jpeg?format=jpeg&width=150&height=150&mode=crop&quality=98",
        description: "On Monday, the new plant of Toaster Inc. was officially opened at Chuansha, Shanghai. "
      },
      {
        id: "1054891",
        title: "Opening of new logistics and distribution center",
        link: generator.detailUrl(),
        description: "The new 10,000 square meter distribution centre in Edison, New Jersey will offer a wide range of logistics services. Together the two Toaster warehouse facilities reinforce the company’s existing network of 19 locations in the USA.",
        thumbnail: "https://my.digitalassistant.app/rimage/demo.adenin.com/images/t0001054891/tp1000126.jpeg?format=jpeg&width=150&height=150&mode=crop&quality=98"        
      },
      {
        id: "1054878",
        title: "New Wi-Fi enabled product line",
        link: generator.detailUrl(),
        description: "We called our new series “Toasti-Fi” because consumers should have access to their home appliances everywhere and anytime. With “Toasti-Fi” we help our customers to stay connected to their home, no matter where they are.",
        thumbnail: "https://my.digitalassistant.app/rimage/demo.adenin.com/images/t0001054878/tp1000126.png?format=jpeg&width=150&height=150&mode=crop&quality=98"        
      }
      /*,
      {
        id: "1054880",
        title: "Leading with passion, mistakes and simplicity",
        link: generator.detailUrl(),
        thumbnail: "https://my.digitalassistant.app/rimage/demo.adenin.com/images/t0001054880/tp1000126.jpeg?format=jpeg&width=150&height=150&mode=crop&quality=98"        
      },
      {
        id: "1054893",
        title: "Multi-Year Agreement signed",
        link: generator.detailUrl(),
        thumbnail: "https://my.digitalassistant.app/rimage/demo.adenin.com/images/t0001054893/tp1000126.jpeg?format=jpeg&width=150&height=150&mode=crop&quality=98"        
      }*/
    ];

    let sortedItems = getItemsBasedOnDayOfTheYear(activity, items);

    var dateRange = $.dateRange(activity);
    let filteredItems = shared.filterItemsByDateRange(sortedItems, dateRange);
    let value = filteredItems.length;

    const pagination = $.pagination(activity);
    let paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;

    activity.Response.Data.title = T(activity, 'News Feed');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All News');
    activity.Response.Data.actionable = value > 0;

    activity.Response.Data.thumbnail = "https://www.adenin.com/assets/images/wp-images/logo/sharepoint-online.svg";

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.date = paginatedItems[0].date; // items are alrady sorted ascending
      activity.Response.Data.description = value > 1 ? T(activity, "You have {0} news items.", value) : T(activity, "You have 1 news item.");
      activity.Response.Data.briefing = activity.Response.Data.description + " The latest is <b>" + activity.Response.Data.items[0].title + "</b>.";
    } else {
      activity.Response.Data.description = T(activity, `You have no news.`);
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};

const morningHour = 8;
const afternoonHour = 14;

//** returns new item[] reordered based on day of the year */
function getItemsBasedOnDayOfTheYear(activity, items) {
  const timeslot1 = moment().tz(activity.Context.UserTimezone).hours(morningHour);
  const timeslot2 = moment().tz(activity.Context.UserTimezone).hours(afternoonHour);

  const userLocalTime = moment().tz(activity.Context.UserTimezone);

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let isTimeslot2 = null; // keeps track of which time to assign to news next (timeslot1 or timeslot2)

  if (userLocalTime.hours() >= 16) {
    isTimeslot2 = true;
  } else if (userLocalTime.hours() >= 10) {
    isTimeslot2 = false;
  } else {
    daysOffset = -1;
    isTimeslot2 = true;
  }

  const d = new Date();

  let zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = zeroBasedDayInYear % items.length;

  const sortedItems = [];
  let newsCounter = 0; // used to count number of news in a day and help generate (date -1),...,(date -n).

  for (let i = 0; i < items.length; i++) {
    if (startIndex >= items.length) startIndex = 0;

    let timeToAssign = null;
    newsCounter++;

    if (isTimeslot2) {
      timeToAssign = timeslot2.clone();

      if (newsCounter >= 2) { // keeps track of number of news and increases days offset when needed
        newsCounter = 0;
        daysOffset--;
      }
    } else {
      timeToAssign = timeslot1.clone();
    }

    timeToAssign.date(timeToAssign.date() + daysOffset);
    timeToAssign.startOf('hour');

    isTimeslot2 = !isTimeslot2; // switch time to assign

    const newsDate = timeToAssign.clone().utc();

    items[startIndex].date = newsDate.toISOString();

    sortedItems.push(items[startIndex]);
    startIndex++;
  }

  return sortedItems;
}
