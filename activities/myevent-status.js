'use strict';

const generator = require('./common/generator');
const logger = require('@adenin/cf-logger');
const moment = require('moment-timezone');
const { isResponseOk, handleError } = require('@adenin/cf-activity');

module.exports = async (activity) => {

  try {

    let ticketStatus = {
      title: 'Open Tickets',
      url: generator.detailUrl(),
      urlLabel: 'All tickets',
    };

    let nbrOfMeetings = generator.randomEntry([0, 3, 7]);
    let contact = generator.teamMember();
    let startHour = generator.randomEntry([0, 2, 3]);
    let startMin = generator.randomEntry([7, 15, 23, 30]);

    let eventStatus = {
      title: 'Events Today',
      url: generator.detailUrl(),
      urlLabel: 'All events',
    };

    if (nbrOfMeetings != 0) {
      let description = `You have ${nbrOfMeetings} events scheduled today. The next meeting with ${contact.name} starts`;

      if (startHour == 0) {
        description += ` in ${startMin} minutes.`;
      } else {
        let tempDate = new Date();

        tempDate.setHours(tempDate.getHours() + startHour);
        tempDate.setMinutes(startMin);

        let temptime = moment(tempDate)
          .tz(activity.Context.UserTimezone)
          .locale(activity.Context.UserLocale)
          .format('LT');

        description += `${getTimePrefix(activity,tempDate)} at ${temptime}.`;
      }
      eventStatus = {
        ...eventStatus,
        description: description,
        color: 'blue',
        value: nbrOfMeetings,
        actionable: true
      }
    } else {
      eventStatus = {
        ...eventStatus,
        description: `You have no events today.`,
        actionable: false
      }
    }

    activity.Response.Data = eventStatus;


  } catch (error) {
    handleError(activity, error);
  }
};

//** returns no prefix, 'tomorrow' prefix, or date prefix */
function getTimePrefix(activity, date) {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let prefix = '';
  if (date.getDate() == tomorrow.getDate()) {
    prefix = ' tomorrow';
  } else if (date > tomorrow) {
    prefix = ` on ${moment(date)
      .tz(activity.Context.UserTimezone)
      .locale(activity.Context.UserLocale)
      .format('LL')
      }`;
  }

  return prefix;
}