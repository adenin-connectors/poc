'use strict';
const generator = require('./common/generator');
const moment = require('moment-timezone');

module.exports = async (activity) => {
  try {
    let nbrOfMeetings = generator.randomEntry([0, 3, 7]);
    let contact = generator.teamMember();
    let startHour = generator.randomEntry([0, 2, 3]);
    let startMin = generator.randomEntry([7, 15, 23, 30]);

    let eventStatus = {
      title: T('Events Today'),
      url: generator.detailUrl(),
      urlLabel: T('All events'),
    };

    if (nbrOfMeetings != 0) {
      let description = T(`You have {0} events scheduled today. The next event with {1} starts`, nbrOfMeetings, contact.name);

      if (startHour == 0) {
        description += T(` in {0} minutes.`, startMin);
      } else {
        let tempDate = new Date();

        tempDate.setHours(tempDate.getHours() + startHour);
        tempDate.setMinutes(startMin);

        let temptime = moment(tempDate)
          .tz(activity.Context.UserTimezone)
          .locale(activity.Context.UserLocale)
          .format('LT');

        description += getTimePrefix(activity, tempDate) + T(" at {0}.", tempDate);
      }
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

//** returns no prefix, 'tomorrow' prefix, or date prefix */
function getTimePrefix(activity, date) {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let prefix = '';
  if (date.getDate() == tomorrow.getDate()) {
    prefix = T(' tomorrow');
  } else if (date > tomorrow) {
    let tmpDate = moment(date)
      .tz(activity.Context.UserTimezone)
      .locale(activity.Context.UserLocale)
      .format('LL');
    prefix = T(' on {0}.', tmpDate);
  }

  return prefix;
}