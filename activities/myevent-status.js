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
      link: generator.detailUrl(),
      linkLabel: T('All events')
    };

    if (nbrOfMeetings != 0) {
      let eventFormatedTime = getEventFormatedTimeAsString(startHour, startMin);
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

//** checks if event is in less then hour, today or tomorrow and returns formated string accordingly */
function getEventFormatedTimeAsString(startHour, startMin) {
  let eventTime = new Date();
  eventTime.setHours(eventTime.getHours() + startHour);
  eventTime.setMinutes(eventTime.getMinutes()+startMin);
  eventTime = moment(eventTime)
    .tz(Activity.Context.UserTimezone)
    .locale(Activity.Context.UserLocale);

  let timeNow = moment( new Date());

  let diffInHrs = eventTime.diff(timeNow, 'hours');

  if (diffInHrs == 0) {
    //events that start in less then 1 hour
    let diffInMins = eventTime.diff(timeNow, 'minutes');
    return T(`in {0} minutes.`, diffInMins);
  } else {
    //events that start in more than 1 hour
    let diffInDays = eventTime.diff(timeNow, 'days');

    let datePrefix = '';
    let momentDate = '';
    if (diffInDays == 1) {
      //events that start tomorrow
      datePrefix = 'tomorrow ';
    } else if (diffInDays > 1) {
      //events that start day after tomorrow and later
      datePrefix = 'on ';
      momentDate = eventTime.format('LL') + " ";
    }

    return T(`{0}{1}{2}{3}.`, T(datePrefix), momentDate, T("at "), eventTime.format('LT'));
  }
}