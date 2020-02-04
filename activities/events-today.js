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
        thumbnail: $.avatarLink('Samanta Jones'),
        imageIsAvatar: true,
        response: {
          status: 'accepted',
          date: now.clone().date(now.date() - 1).hours(9).startOf('hour').format()
        },
        organizer: {
          email: '',
          name: 'Samanta Jones',
          avatar: $.avatarLink('Samanta Jones')
        },
        attendees: [
          {
            email: '',
            name: 'Samanta Jones',
            avatar: $.avatarLink('Samanta Jones'),
            response: 'organizer'
          },
          {
            email: '',
            name: 'Toney Johnston',
            avatar: $.avatarLink('Toney Johnston'),
            response: 'accepted'
          },
          {
            email: '',
            name: 'Darion Kemmer',
            avatar: $.avatarLink('Darion Kemmer'),
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
        thumbnail: $.avatarLink('Everett Hoppe'),
        imageIsAvatar: true,
        response: null,
        organizer: {
          email: '',
          name: 'Everett Hoppe',
          avatar: $.avatarLink('Everett Hoppe')
        },
        attendees: [
          {
            email: '',
            name: 'Everett Hoppe',
            avatar: $.avatarLink('Everett Hoppe'),
            response: 'organizer'
          },
          {
            email: '',
            name: 'Dudley Harris',
            avatar: $.avatarLink('Dudley Harris'),
            response: null
          },
          {
            email: '',
            name: 'Roberta Adams',
            avatar: $.avatarLink('Roberta Adams'),
            response: 'declined'
          },
          {
            email: '',
            name: 'Ophelia Nienow',
            avatar: $.avatarLink('Ophelia Nienow'),
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
        thumbnail: $.avatarLink('Abdiel Rice'),
        imageIsAvatar: true,
        response: {
          status: 'declined',
          date: now.clone().date(now.date() - 3).hours(9).startOf('hour').format()
        },
        organizer: {
          email: '',
          name: 'Abdiel Rice',
          avatar: $.avatarLink('Abdiel Rice')
        },
        attendees: [
          {
            email: '',
            name: 'Abdiel Rice',
            avatar: $.avatarLink('Abdiel Rice'),
            response: 'organizer'
          },
          {
            email: '',
            name: 'Charles Lynch',
            avatar: $.avatarLink('Charles Lynch'),
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

          if (firstFutureIndex === null) firstFutureIndex = items.length - 1;
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
