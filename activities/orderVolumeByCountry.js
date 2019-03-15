'use strict';

const api = require('./common/api');

module.exports = async (activity) => {
  try {
    activity.Response.Data = {
      chart: {
        configuration: {
          data: {
            labels: ['UK', 'USA', 'Germany'],
            datasets: [
              {
                label: '2018',
                data: [1354, 3434, 2456]
              },
              {
                label: '2019',
                data: [1245, 3646, 2234]
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: 'Order Volume'
            }
          }
        },
        template: 'bar',
        palette: 'office.Office6'
      }
    };
  } catch (error) {
    api.handleError(activity, error);
  }
};
