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

    let noOfTickets = generator.randomEntry([0, 3, 7]);;

    if (noOfTickets != 0) {
      ticketStatus = {
        ...ticketStatus,
        description: `You have ${noOfTickets} tickets assigned`,
        color: 'blue',
        value: noOfTickets,
        actionable: true
      }
    } else {
      ticketStatus = {
        ...ticketStatus,
        description: `You have no tickets assigned`,
        actionable: false
      }
    }

    activity.Response.Data = ticketStatus;

  } catch (error) {
    // handle generic exception
    handleError(activity, error);
  }
};
