'use strict';

const moment = require('moment-timezone');

module.exports = async (activity) => {
  try {
    const path = activity.Request.Path;
    let items = getItems(path);

    items = getItemsBasedOnDayOfTheYear(activity, items);

    const description = `You have ${items.length} pending${path ? path.replace(/-|\//g, ' ') : ''} approvals.`;

    activity.Response.Data = {
      items: items,
      value: items.length,
      actionable: items.length > 0,
      description: description,
      briefing: description + ` The latest is ${items[0].title}`,
      integration: 'Digital Assistant',
      thumbnail: 'https://www.adenin.com/assets/images/identity/logo_adenin_round.png',
      link: 'https://adenin.com/pocdef',
      linkLabel: 'Open Approvals app',
      _card: {
        type: 'my-approvals'
      }
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};

const morningHour = 10;
const morningMinutes = 16;
const afternoonHour = 12;
const afternoonMinutes = 54;

//** returns new item[] reordered based on day of the year */
function getItemsBasedOnDayOfTheYear(activity, items) {
  const timeslot1 = moment().tz(activity.Context.UserTimezone).hours(morningHour).minutes(morningMinutes);
  const timeslot2 = moment().tz(activity.Context.UserTimezone).hours(afternoonHour).minutes(afternoonMinutes);

  const userLocalTime = moment().tz(activity.Context.UserTimezone);

  const d = new Date();

  let daysOffset = 0; //number of days to offset current date (now - daysOffset)
  let isTimeslot2 = null; // keeps track of which time to assign to news next (timeslot1 or timeslot2)

  if (userLocalTime.hours() >= (afternoonHour + 1)) {
    isTimeslot2 = true;
  } else if (userLocalTime.hours() >= (morningHour + 1)) {
    isTimeslot2 = false;
  } else {
    daysOffset = -1;
    isTimeslot2 = true;
  }

  const zeroBasedDayInYear = ((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  let startIndex = zeroBasedDayInYear % items.length;

  if (isTimeslot2) startIndex++;

  const sortedItems = [];
  let counter = 0; // used to count number of news in a day and help generate (date -1),...,(date -n).

  for (let i = 0; i < items.length; i++) {
    if (startIndex >= items.length) startIndex = 0;
    else if (startIndex < 0) startIndex = items.length - 1;

    let timeToAssign = null;
    counter++;

    if (isTimeslot2) {
      timeToAssign = timeslot2.clone();

      if (counter >= 2) { // keeps track of number of news and increases days offset when needed
        counter = 0;
        daysOffset--;
      }
    } else {
      timeToAssign = timeslot1.clone();
    }

    timeToAssign.date(timeToAssign.date() + daysOffset);
    timeToAssign.startOf('minute');

    isTimeslot2 = !isTimeslot2; // switch time to assign

    const date = timeToAssign.clone().utc();

    items[startIndex].date = date.toISOString();

    sortedItems.push(items[startIndex]);
    startIndex++;
  }

  return sortedItems;
}

function getItems(path) {
  switch (path) {
  case '/sales':
    return [
      {
        title: 'Network Switch LX3, Northwind Inc.',
        description: 'Standard terms sale - $489',
        integration: 'Salesforce',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg'
      },
      {
        title: '10x Server CPU Cooler SC1, Cookiecutter Inc.',
        description: 'Discount sale - $1,790 at 10% discount',
        integration: 'Salesforce',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg'
      },
      {
        title: '2x rackmount webserver S2, Axe Capital',
        description: 'Non-standard terms sale, $8,596',
        integration: 'Salesforce',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg'
      },
      {
        title: '40x IP Conference Phone CF10, Wayne Enterprises',
        description: 'Non-standard terms sale, $4,580',
        integration: 'Salesforce',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg'
      },
      {
        title: 'Floorstanding rackmount server cabinet, Duke & Duke',
        description: 'Discount sale, $1,350 at 5% discount',
        integration: 'Salesforce',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/salesforce.svg'
      }
    ];
  case '/travel-and-leave':
    return [
      {
        title: 'PTO Request from Jennifer Carrington',
        description: '8 Days - from 08/01 to 08/08',
        integration: 'Leave Approval'
      },
      {
        title: 'Expense reimbursement from Tony Henry',
        description: 'Trip to San Jose, CA - $4,574',
        integration: 'Travel Approval'
      },
      {
        title: 'PTO Request from Cole Greenfelder',
        description: '3 days, 10/14 - 10/16',
        integration: 'Leave Approval'
      },
      {
        title: 'Sick leave notice from Nelson Medhurst',
        description: 'Scheduled Doctors appointment on 09/06',
        integration: 'Leave Approval'
      },
      {
        title: 'Expense Reimbursement from Randy White',
        description: 'Developer\'s conference travel costs - $230',
        integration: 'Travel Approval'
      }
    ];
  case '/hardware':
    return [
      {
        title: 'Equipment Request from Stephen Michael',
        description: 'Laptop renewal - Apple MacBook Pro 15"',
        integration: 'ServiceNow',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/servicenow.svg'
      },
      {
        title: 'Equipment Request from Marlon Greenfelder',
        description: 'Work from Home - Company PC',
        integration: 'ServiceNow',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/servicenow.svg'
      }
    ];
  default:
    return [
      {
        title: 'PTO Request from Jennifer Carrington',
        description: '8 Days - from 08/01 to 08/08',
        integration: 'Workday',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/workday.svg'
      },
      {
        title: 'Equipment Request from Stephen Michael',
        description: 'Laptop renewal - Apple MacBook Pro 15"',
        integration: 'SAP Fieldglass',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/sap-fieldglass.svg'
      },
      {
        title: 'Expense reimbursement from Tony Henry',
        description: 'Trip to San Jose, CA - $4,574',
        integration: 'SAP Concur',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/sap-concur.svg'
      },
      {
        title: 'Document approval from Melissa O\'Ciaran',
        description: 'Marketing Roadmap 03.docx - Marketing Group',
        integration: 'SharePoint',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/sharepoint-online.svg'
      },
      {
        title: 'PTO Request from Cole Greenfelder',
        description: '3 days, 10/14 - 10/16',
        integration: 'SharePoint',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/sharepoint-online.svg'
      },
      {
        title: 'Equipment Request from Marlon Greenfelder',
        description: 'Work from Home - Company PC',
        integration: 'SAP Concur',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/sap-concur.svg'
      },
      {
        title: 'Sick leave notice from Nelson Medhurst',
        description: 'Scheduled Doctors appointment on 09/06',
        integration: 'Workday',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/workday.svg'
      },
      {
        title: 'Expense Reimbursement from Randy White',
        description: 'Developer\'s conference travel costs - $230',
        integration: 'SAP Fieldglass',
        thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/sap-fieldglass.svg'
      }
    ];
  }
}
