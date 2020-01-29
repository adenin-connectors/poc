'use strict';

const crypto = require('crypto');

const moment = require('moment-timezone');

const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    moment.tz.setDefault(activity.Context.UserTimezone);

    const now = moment();
    const events = [
      {
        id: 1,
        title: 'Board Meeting',
        description: 'Lorem ipsum',
        link: generator.detailUrl(),
        date: now.clone().hours(9).minutes(30).startOf('minute').format(),
        endDate: now.clone().hours(10).minutes(30).startOf('minute').format(),
        isCancelled: false,
        isRecurring: false,
        onlineMeetingUrl: generator.detailUrl(),
        location: null,
        thumbnail: $.avatarLink('Nelson Berge'),
        imageIsAvatar: true,
        response: {
          status: 'accepted',
          date: now.clone().date(now.date() - 1).hours(9).startOf('hour').format()
        },
        organizer: {
          email: '',
          name: 'Nelson Berge',
          avatar: $.avatarLink('Nelson Berge')
        },
        attendees: [
          {
            email: '',
            name: 'Nelson Berge',
            avatar: $.avatarLink('Nelson Berge'),
            response: 'organizer'
          },
          {
            email: '',
            name: 'Cristina Medhurst',
            avatar: $.avatarLink('Cristina Medhurst'),
            response: 'accepted'
          },
          {
            email: '',
            name: 'Hilma Strosin',
            avatar: $.avatarLink('Hilma Strosin'),
            response: null
          }
        ]
      },
      {
        id: 2,
        title: 'UI/UX Rebrand Briefing',
        description: 'Lorem ipsum',
        link: generator.detailUrl(),
        date: now.clone().hours(14).minutes(0).startOf('minute').format(),
        endDate: now.clone().hours(16).minutes(0).startOf('minute').format(),
        isCancelled: false,
        isRecurring: false,
        onlineMeetingUrl: generator.detailUrl(),
        location: null,
        thumbnail: $.avatarLink('Randy Kshlerin'),
        imageIsAvatar: true,
        response: null,
        organizer: {
          email: '',
          name: 'Randy Kshlerin',
          avatar: $.avatarLink('Randy Kshlerin')
        },
        attendees: [
          {
            email: '',
            name: 'Randy Kshlerin',
            avatar: $.avatarLink('Randy Kshlerin'),
            response: 'organizer'
          },
          {
            email: '',
            name: 'Blaze Hoeger',
            avatar: $.avatarLink('Blaze Hoeger'),
            response: null
          },
          {
            email: '',
            name: 'Hilma Strosin',
            avatar: $.avatarLink('Hilma Strosin'),
            response: 'declined'
          },
          {
            email: '',
            name: 'Abdul Carroll',
            avatar: $.avatarLink('Abdul Carroll'),
            response: 'accepted'
          }
        ]
      },
      {
        id: 3,
        title: 'Performance Review',
        description: 'Lorem ipsum',
        link: generator.detailUrl(),
        date: now.clone().hours(16).minutes(30).startOf('minute').format(),
        endDate: now.clone().hours(17).minutes(0).startOf('minute').format(),
        isCancelled: true,
        isRecurring: false,
        onlineMeetingUrl: generator.detailUrl(),
        location: null,
        thumbnail: $.avatarLink('Eriberto White'),
        imageIsAvatar: true,
        response: {
          status: 'declined',
          date: now.clone().date(now.date() - 3).hours(9).startOf('hour').format()
        },
        organizer: {
          email: '',
          name: 'Eriberto White',
          avatar: $.avatarLink('Eriberto White')
        },
        attendees: [
          {
            email: '',
            name: 'Eriberto White',
            avatar: $.avatarLink('Eriberto White'),
            response: 'organizer'
          },
          {
            email: '',
            name: 'Cristina Medhurst',
            avatar: $.avatarLink('Cristina Medhurst'),
            response: 'declined'
          }
        ]
      }
    ];

    const items = [];

    let count = 0;
    let firstFutureIndex = null;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      const eventDate = moment(event.date).utc();
      const endDate = moment(event.endDate).utc();
      const overAnHourAgo = now.clone().minutes(now.minutes() - 61);

      if (now.isSame(eventDate, 'date') && endDate.isAfter(overAnHourAgo)) {
        event.duration = moment.duration(eventDate.diff(endDate)).humanize();
        items.push(event);

        if (eventDate.isAfter(now)) {
          count++;

          if (!firstFutureIndex) firstFutureIndex = items.length - 1;
        }
      }
    }

    const pagination = $.pagination(activity);
    const paginatedItems = shared.paginateItems(items, pagination);

    activity.Response.Data.items = paginatedItems;
    activity.Response.Data._hash = crypto.createHash('md5').update(JSON.stringify(paginatedItems)).digest('hex');

    if (parseInt(pagination.page) === 1) {
      activity.Response.Data.title = T(activity, 'Events Today');
      activity.Response.Data.link = generator.detailUrl();
      activity.Response.Data.linkLabel = T(activity, 'All events');
      activity.Response.Data.thumbnail = 'https://www.adenin.com/assets/images/wp-images/logo/office-365.svg';
      activity.Response.Data.actionable = count > 0;

      if (count > 0) {
        const first = activity.Response.Data.items[firstFutureIndex];

        activity.Response.Data.value = paginatedItems.length;
        activity.Response.Data.date = first.date;
        activity.Response.Data.description = paginatedItems.length > 1 ? `You have ${paginatedItems.length} events today.` : 'You have 1 event today.';

        activity.Response.Data.briefing = activity.Response.Data.description + ` The next is <b>'${first.title}'</b> at ${moment(first.date).format('LT')}`;
      } else {
        activity.Response.Data.description = T(activity, 'You have no events today.');
      }
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};
