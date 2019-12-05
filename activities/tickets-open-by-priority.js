'use strict';
const generator = require('./common/generator');

module.exports = async (activity) => {
  const maxVal = 99;
  const randomData = [];

  for (let i = 0; i < 3; i++) {
    randomData.push(getRandomInt(maxVal));
  }

  try {
    activity.Response.Data = {
      title: T(activity, 'Open Tickets By Priority'),
      link: generator.detailUrl(),
      linkLabel: T(activity, 'Open Dashboard'),
      chart: {
        configuration: {
          data: {
            labels: [
              T(activity, 'High'),
              T(activity, 'Medium'),
              T(activity, 'Low')
            ],
            datasets: [{
              data: randomData
            }]
          },
          options: {
            title: {
              display: true,
              text: T(activity, 'Open Tickets By Priority')
            }
          }
        },
        template: 'pie-labels',
        palette: 'adenin.PriorityRedOrangeBlue'
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
