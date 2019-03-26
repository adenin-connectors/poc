'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');

module.exports = async (activity) => {
  try {
    let nbrOfMeetings = generator.randomEntry([0, 1, 7]);
    let contact = generator.teamMember();
    let startHour = generator.randomEntry([0, 2, 3]);
    let startMin = generator.randomEntry([7, 15, 23, 30]);

    let eventStatus = {
      title: T('Events Today'),
      url: generator.detailUrl(),
      urlLabel: T('All events'),
    };

    if (nbrOfMeetings != 0) {
      let eventFormatedTime = getEventStartTime(startHour, startMin);
      let eventPluralorNot = nbrOfMeetings > 1 ? T("events scheduled") : T("event scheduled");
      let description = T(`You have {0} {1} today. The next event with {2} starts {3}`, nbrOfMeetings, eventPluralorNot, contact.name, eventFormatedTime);

      eventStatus = {
        ...eventStatus,
        description: description,
        color: 'blue',
        value: nbrOfMeetings,
        actionable: true
      };
    } else {
      eventStatus = {
        ...eventStatus,
        description: T(`You have no events today.`),
        actionable: false
      };
    }

    activity.Response.Data = eventStatus;
  } catch (error) {
    Activity.handleError(error);
  }
};
//** function that generates date for testing based on provided hours and minutes */
function getEventStartTime(startHour, startMin) {
  let tempDate = new Date();
  if (startHour == 0) {
    //events that start in less then 1 hour
    return T(`in {0} minutes.`, startMin);
  } else {
    tempDate.setHours(tempDate.getHours() + startHour);
    tempDate.setMinutes(startMin);
    return getTimePrefix(Activity, tempDate);
  }
}
//** returns no prefix, 'tomorrow' prefix, or date prefix */
function getTimePrefix(activity, date) {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let prefix = '';
  if (date.getDate() == tomorrow.getDate()) {
    //events tomorrow
    let temptime = moment(date)
      .tz(Activity.Context.UserTimezone)
      .locale(Activity.Context.UserLocale)
      .format('LT');
    prefix = T('tomorrow at {0}.', temptime);
  } else if (date > tomorrow) {
    //events after tommorrow
    let tmpDate = moment(date)
      .tz(Activity.Context.UserTimezone)
      .locale(Activity.Context.UserLocale)
      .format('LL');
    prefix = T('on {0}.', tmpDate);
  } else if (date) {
    //event is today
    let temptime = moment(date)
      .tz(Activity.Context.UserTimezone)
      .locale(Activity.Context.UserLocale)
      .format('LT');
    prefix = T('at {0}.', temptime);
  }

  return prefix;
}