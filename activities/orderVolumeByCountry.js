'use strict';

const generator = require('./common/generator');

module.exports = async (activity) => {
  const currentYear = new Date().getFullYear();

  const maxVal = 99 * 100;
  const randomData0 = [];
  const randomData1 = [];

  for (let i = 0; i < 3; i++) {
    randomData0.push(getRandomInt(maxVal));
    randomData1.push(getRandomInt(maxVal));
  }

  try {
    activity.Response.Data = {
      title: T(activity, 'Order Volume'),
      link: generator.detailUrl(),
      linkLabel: T(activity, 'Sales Dashboard'),
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
              text: T(activity, 'Order Volume')
            }
          }
        },
        template: 'bar',
        palette: 'office.Office6'
      }
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};

//** generates random int value */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
