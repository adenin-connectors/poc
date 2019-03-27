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
        description: noOfTickets > 1 ? T('You have {0} tickets assigned', noOfTickets) : T('You have 1 ticket assigned'),
        color: 'blue',
        value: noOfTickets,
        actionable: true
      };
    } else {
      ticketStatus = {
        ...ticketStatus,
        description: T('You have no tickets assigned'),
        actionable: false
      };
    }

    activity.Response.Data = ticketStatus;
  } catch (error) {
    // handle generic exception
    Activity.handleError(error);
  }
};
