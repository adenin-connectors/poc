'use strict';

const faker = require('faker');

const detailUrl = 'https://www.adenin.com/pocdef';

module.exports = {
  randomEntry: function (arr) {
    const rnd = Math.floor(0.5 + Math.random() * 100);
    const i = rnd % arr.length;

    return arr[i];
  },
  detailUrl: () => detailUrl,
  teamMember: function () {
    return {
      name: faker.name.findName()
    };
  },
  ticketsList: () => [
    {
      id: '1054889',
      title: 'Damaged product, could I have a refund?',
      link: detailUrl,
      thumbnail: $.avatarLink('SR'),
      imageIsAvatar: true,
      statusText: 'Open'
    },
    {
      id: '1054891',
      title: 'When will I receive my order?',
      link: detailUrl,
      thumbnail: $.avatarLink('AD'),
      imageIsAvatar: true,
      statusText: 'Open'
    },
    {
      id: '1054878',
      title: 'Cannot finish checkout process.',
      link: detailUrl,
      thumbnail: $.avatarLink('BB'),
      imageIsAvatar: true,
      statusText: 'Closed'
    },
    {
      id: '1054880',
      title: 'Locked out of my account, no access to email.',
      link: detailUrl,
      thumbnail: $.avatarLink('CR'),
      imageIsAvatar: true,
      statusText: 'Open'
    },
    {
      id: '1054893',
      title: 'Request product exchange.',
      link: detailUrl,
      thumbnail: $.avatarLink('SW'),
      imageIsAvatar: true,
      statusText: 'Open'
    },
    {
      id: '1054874',
      title: 'Card has been charged twice.',
      link: detailUrl,
      thumbnail: $.avatarLink('MZ'),
      imageIsAvatar: true,
      statusText: 'Closed'
    },
    {
      id: '1054875',
      title: 'My coupon does not work.',
      link: detailUrl,
      thumbnail: $.avatarLink('AP'),
      imageIsAvatar: true,
      statusText: 'Open'
    },
    {
      id: '1054876',
      title: 'Account is suspended?',
      link: detailUrl,
      thumbnail: $.avatarLink('KL'),
      imageIsAvatar: true,
      statusText: 'Open'
    },
    {
      id: '1054877',
      title: 'Want more info about this product.',
      link: detailUrl,
      thumbnail: $.avatarLink('TD'),
      imageIsAvatar: true,
      statusText: 'Closed'
    }
  ],
  leadsList: () => [
    {
      id: '32101',
      title: 'Marcus Jones',
      description: 'Maggio - Marks',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e6801a36d3b380006d3c72f-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32102',
      title: 'Ricky Oliver',
      description: 'Grady Inc',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e6801c46d3b380006d3cedb-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32103',
      title: 'Terry Nguyen',
      description: 'David - Kuhlman',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e6887c36d3b380006f1da63-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32104',
      title: 'Arron Long',
      description: 'Williamson, Torp and Koepp',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e68015d6d3b380006d3b6eb-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32105',
      title: 'Misty Larson',
      description: 'Hayes Inc',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e6801626d3b380006d3b82f-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32106',
      title: 'Beverly Thomas',
      description: 'Stanton - Gusikowski',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e6869016d3b380006ead99f-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32107',
      title: 'April Crawford',
      description: 'Leannon - Roob',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e6889406d3b380006f23085-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32108',
      title: 'Ricardo Turner',
      description: 'McLaughlin, Cummerata and Crona',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5f896d365bec830008375f28-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32109',
      title: 'Tamara Pearson',
      description: 'Waters Group',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5f896f545bec830008382c00-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32110',
      title: 'Ellen Willis',
      description: 'Kutch - Flatley',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5f8971ee5bec830008391f96-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32111',
      title: 'Regina Bowman',
      description: 'Haag - Boehm',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5f8974a45bec8300083a191d-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32112',
      title: 'Alexander Hopkins',
      description: 'Gorczany, Koch and Schowalter',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e6885ff6d3b380006f17273-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32113',
      title: 'Katrina Lynch',
      description: 'Von, Huel and MacGyver',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e68014d6d3b380006d3b355-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32114',
      title: 'Connor Bailey',
      description: 'Schmitt - Ratke',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5e6801926d3b380006d3c33b-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32115',
      title: 'Danielle Pena',
      description: 'Schowalter LLC',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5f8975995bec8300083a6f03-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32116',
      title: 'Darryl Henderson',
      description: 'Littel and Sons',
      thumbnail: 'https://www.adenin.com/assets/images/generated_photos/5f896a9b5bec830008365b3f-l.jpg',
      imageIsAvatar: true,
      link: detailUrl
    }
  ]
};
