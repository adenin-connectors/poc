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
  leadsList: () => [
    {
      id: '32101',
      title: 'Mr. Marlon Schuppe',
      description: 'Maggio - Marks',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/ssiskind/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32102',
      title: 'Cole Kirlin',
      description: 'Grady Inc',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/herrhaase/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32103',
      title: 'Myrl Kovacek',
      description: 'David - Kuhlman',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/vytautas_a/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32104',
      title: 'Haven Greenfelder',
      description: 'Williamson, Torp and Koepp',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/macxim/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32105',
      title: 'Raphaelle Jaskolski',
      description: 'Hayes Inc',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/aislinnkelly/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32106',
      title: 'Rebecca Collins',
      description: 'Stanton - Gusikowski',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/rpatey/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32107',
      title: 'Rigoberto Okuneva',
      description: 'Leannon - Roob',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/emmeffess/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32108',
      title: 'Daniella Kub',
      description: 'McLaughlin, Cummerata and Crona',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/maiklam/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32109',
      title: 'Sedrick O\'Connell',
      description: 'Waters Group',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/doronmalki/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32110',
      title: 'Nelson Berge',
      description: 'Kutch - Flatley',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/lowie/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32111',
      title: 'Cristina Medhurst',
      description: 'Haag - Boehm',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/larrybolt/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32112',
      title: 'Hilma Strosin',
      description: 'Gorczany, Koch and Schowalter',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/ddggccaa/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32113',
      title: 'Randy Kshlerin',
      description: 'Von, Huel and MacGyver',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/artem_kostenko/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32114',
      title: 'Blaze Hoeger',
      description: 'Schmitt - Ratke',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/nsamoylov/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32115',
      title: 'Abdul Carroll',
      description: 'Schowalter LLC',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/jacobbennett/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    },
    {
      id: '32116',
      title: 'Eriberto White',
      description: 'Littel and Sons',
      thumbnail: 'https://s3.amazonaws.com/uifaces/faces/twitter/newbrushes/128.jpg',
      imageIsAvatar: true,
      link: detailUrl
    }
  ]
};
