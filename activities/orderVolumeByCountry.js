'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  let currentYear = new Date().getFullYear();
  try {
    activity.Response.Data = {
      chart: {
        configuration: {
          data: {
            labels: ['UK', 'USA', 'Germany'],
            datasets: [
              {
                label: currentYear - 1,
                data: [getRandomInt(100) * 100, getRandomInt(100) * 100, getRandomInt(100) * 100]
              },
              {
                label: currentYear,
                data: [getRandomInt(100) * 100, getRandomInt(100) * 100, getRandomInt(100) * 100]
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

//** generates random int value */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}