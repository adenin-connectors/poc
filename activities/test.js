'use strict';
const generator = require('./common/generator');

module.exports = async (activity) => {

  try {

    let ticketStatus = {
      title: T('Open Tickets'),
      link: generator.detailUrl(),
      linkLabel: T('All tickets')
    };

    let noOfTickets = generator.randomEntry([0, 3, 7]);

    if (noOfTickets != 0) {
      ticketStatus = {
        ...ticketStatus,
        description: T(`You have {0} tickets assigned`, noOfTickets),
        color: 'blue',
        value: noOfTickets,
        actionable: true
      }
    } else {
      ticketStatus = {
        ...ticketStatus,
        description: T(`You have no tickets assigned`),
        actionable: false
      }
    }

    activity.Response.Data = ticketStatus;

    activity.Response.Data = process.env;

  } catch (error) {
    // handle generic exception
    Activity.handleError(error);
  }
};
