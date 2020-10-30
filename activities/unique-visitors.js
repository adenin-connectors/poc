'use strict';

const moment = require('moment-timezone');
const generator = require('./common/generator');

module.exports = async (activity) => {
  try {
    activity.Response.Data = generateChartData(activity);
    activity.Response.Data.title = T(activity, 'Unique Visitors');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Data');
    activity.Response.Data._card = {
      type: 'chart'
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};

function generateChartData(activity) {
  const categories = [];

  const now = moment();

  for (let i = 8; i > 0; i--) {
    categories.push(now.clone().subtract(i, 'days').format('Do MMM'));
  }

  const datasets = [];
  const data = [];

  for (let x = 0; x < categories.length; x++) {
    const number = Math.floor(Math.random() * (6000 - 4000) + 4000);
    data.push(number);
  }

  datasets.push({label: T(activity, 'Unique Visitors'), data, fill: false});

  const chartData = {
    title: T(activity, 'Unique Visitors'),
    link: generator.detailUrl(),
    linkLabel: T(activity, 'All Data'),
    chart: {
      configuration: {
        data: {},
        options: {
          title: {
            display: true,
            text: T(activity, 'Unique Visitors')
          }
        }
      },
      template: 'line'
    },
    _settings: {}
  };

  chartData.chart.configuration.data.labels = categories;
  chartData.chart.configuration.data.datasets = datasets;

  return chartData;
}
