'use strict';

const api = require('./common/api');

module.exports = async (activity) => {
  try {
    activity.Response.Data = {
      chart: {
        dimensions: {
          width: 600,
          height: 400
        },
        configuration: {
          type: 'bar',
          data: {
            labels: ['UK', 'USA', 'Germany'],
            datasets: [{
              data: [1354, 3434, 2456]
            }]
          }
        },
        template: 'bar',
        palette: 'material'
      }
    };
  } catch (error) {
    api.handleError(activity, error);
  }
};
