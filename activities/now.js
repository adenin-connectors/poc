'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');
const shared = require('./common/shared');

const d = new Date();
module.exports = async (activity) => {

  try {
    activity.Response.Data.items = [];
    activity.Response.Data.title = T(activity, 'Current time');
    activity.Response.Data.actionable = true;
    activity.Response.Data.description =  moment(new Date()).format("LTS");
  } catch (error) {
    $.handleError(activity, error);
  }
};

//** returns new item[] reordered based on day of the year */
function sortItemsBasedOnDayOfTheYear(activity, items) {
  let morningHour = 10;
  let afternoonHour = 14;
  let timeslot1 = new Date();
  timeslot1.setHours(morningHour);
  let timeslot2 = new Date();
  timeslot2.setHours(afternoonHour);

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let isTimeslot2 = null; // keeps track of which time to assign next (timeslot1 or timeslot2)
  let userLocalTime = moment(d).tz(activity.Context.UserTimezone);

  if (userLocalTime.hours() >= morningHour && userLocalTime.hours() < afternoonHour) {
    isTimeslot2 = true;
  } else if (userLocalTime.hours() >= afternoonHour) {
    isTimeslot2 = false;
    daysOffset = 1;
  } else {
    isTimeslot2 = false;
  }

  let zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = zeroBasedDayInYear % items.length;

  let sortedItems = [];
  let newsCounter = 0; // used to count number of news in a day and help generate (date -1),...,(date -n).
  for (let i = 0; i < items.length; i++) {
    if (startIndex >= items.length) {
      startIndex = 0;
    }

    let timeToAssign = null;
    newsCounter++;
    if (isTimeslot2) {
      timeToAssign = new Date(timeslot2);
    } else {
      timeToAssign = new Date(timeslot1);
      if (newsCounter >= 2) { // keeps track of number of news and increases days offset when needed
        newsCounter = 0;
        daysOffset++;
      }
    }

    timeToAssign.setDate(timeToAssign.getDate() + daysOffset);
    timeToAssign.setMinutes(roundMinutes(shared.getRandomInt(60)));
    isTimeslot2 = !isTimeslot2; // switch time to assign

    let itemDate = moment(timeToAssign).tz(activity.Context.UserTimezone);

    items[startIndex].date = itemDate.toISOString();
    sortedItems.push(items[startIndex]);
    startIndex++;
  }

  return sortedItems;
}

function roundMinutes(minutes){
  let roundMinutes = 0;
  if(minutes>7 && minutes<=22){
    roundMinutes = 15;
  }else if(minutes>22 && minutes<=37){
    minutes = 30;
  }else if(minutes>37 && minutes<=52){
    minutes = 45;
  }
  return roundMinutes;
}