'use strict';
const generator = require('./common/generator');
const api = require('./common/api');

module.exports = async () => {
  try {

    let d = new Date();

    let items = [
      {
        id: 0,
        title: `Budget Plan ${d.getFullYear() + 1}`,
        description: `description 0`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, 0, 0).toUTCString()
      },
      {
        id: 1,
        title: `Meeting Notes Project 35345`,
        description: `description 1`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 15, 0, 0).toUTCString()
      },
      {
        id: 2,
        title: `Sales Report ${d.getMonth() - 1}.${d.getFullYear()}`,
        description: `description 2`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth(), 1, 10, 0, 0).toUTCString()
      },
      {
        id: 3,
        title: `Form 232 Draft`,
        description: `description 3`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth(), -1, 11, 0, 0).toUTCString()
      },
      {
        id: 4,
        title: `Sales Report ${d.getMonth() - 2}.${d.getFullYear()}`,
        description: `description 4`,
        link: generator.detailUrl(),
        date: new Date(d.getFullYear(), d.getMonth() - 1, 1, 14, 0, 0).toUTCString()
      }
    ];

    Activity.Response.Data = items;
    Activity.Response.Data.title = T('Recent Documents');
    Activity.Response.Data.link = generator.detailUrl();
    Activity.Response.Data.linkLabel = T('Open Documents');
  } catch (error) {
    api.handleError(Activity, error);
  }
};