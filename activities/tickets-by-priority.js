'use strict';
const generator = require('./common/generator');

module.exports = async () => {
  const maxVal = 99;
  const randomData = [];

  for (let i = 0; i < 3; i++) {
    randomData.push(getRandomInt(maxVal));
  }

  try {
    Activity.Response.Data = {
      title: T('Tickets By Priority'),
      link: generator.detailUrl(),
      linkLabel: T('Open Dashboard'),
      chart: {
        configuration: {
          data: {
            labels: [
              T('High'),
              T('Medium'),
              T('Low')
            ],
            datasets: [{
              data: randomData
            }]
          },
          options: {
            title: {
              display: true,
              text: T('Tickets By Priority')
            }
          }
        },
        template: 'pie'
      }
    };
  } catch (error) {
    Activity.handleError(error);
  }
};

//** generates random int value */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
