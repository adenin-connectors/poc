'use strict';

const generator = require('./common/generator');
const logger = require('@adenin/cf-logger');
const {isResponseOk, handleError} = require('@adenin/cf-activity');

module.exports = async (activity) => {

  try {

    let ticketStatus = {
      title: 'Open Tickets',
      url: generator.detailUrl(),
      urlLabel: 'All tickets',
    };

    let nbrOfMeetings = generator.randomEntry([0, 3, 7]);
    let contact = generator.teamMember();
    let startHour = generator.randomEntry([2,3]);
    let startMin = generator.randomEntry([7, 15, 23, 30]);
    
    let eventStatus = {
      title: 'Events Today',
      url: generator.detailUrl(),
      urlLabel: 'All events',
    };

    if (nbrOfMeetings != 0) {

      eventStatus = {
        ...eventStatus,
        description: `You have ${nbrOfMeetings} events scheduled today. The next meeting with ${contact.name} starts in ${startHour} hours and ${startMin} minutes.`,
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
    // handle generic exception
    handleError(activity, error);
  }
};
