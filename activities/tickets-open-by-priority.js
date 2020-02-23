'use strict';
const generator = require('./common/generator');

module.exports = async (activity) => {
  const maxVal = 99;
  const randomData = [];
  var cnt = 0;

  for (let i = 0; i < 3; i++) {
    var rv = getRandomInt(maxVal);
    cnt = cnt + rv;
    randomData.push(rv);
  }

  try {
    activity.Response.Data = {
      title: T(activity, 'Open Tickets By Priority'),
      description: 'Currently there are ' +  randomData[0] + ' high priority tickets open.',
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
  var r = Math.floor(Math.random() * Math.floor(max));
  if (r < 2) r = 2;
  return r;
}
