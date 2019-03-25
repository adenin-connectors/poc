'use strict';

const generator = require('./common/generator');
const api = require('./common/api');

module.exports = async (activity) => {
  let currentYear = new Date().getFullYear();

  let maxVal = 99 * 100;
  let randomData0 = [];
  let randomData1 = [];

  for (let i = 0; i < 3; i++) {
    randomData0.push(getRandomInt(maxVal));
    randomData1.push(getRandomInt(maxVal));
  }

  try {
    activity.Response.Data = {
      title: T('Order Volume'),
      link: generator.detailUrl(),
      linkLabel: T('Sales Dashboard'),
      chart: {
        configuration: {
          data: {
            labels: ['UK', 'USA', 'Germany'],
            datasets: [
              {
                label: currentYear - 1,
                data: randomData0
              },
              {
                label: currentYear,
                data: randomData1
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: T('Order Volume')
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