'use strict';

const moment = require('moment-timezone');
const generator = require('./common/generator');

module.exports = async (activity) => {
  try {
    activity.Response.Data = generateChartData(activity);
    activity.Response.Data.title = T(activity, 'Page Views');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Data');
    activity.Response.Data.thumbnail = 'https://adenin.com/assets/images/identity/Icon_Digital_Assistant.svg';
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
  const labels = ['News', 'Projects', 'Policies', 'Other'];

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const data = [];

    for (let x = 0; x < categories.length; x++) {
      let number;

      switch (label) {
      case 'News':
        number = Math.floor(Math.random() * (6000 - 3000) + 3000);
        break;
      case 'Projects':
        number = Math.floor(Math.random() * (4000 - 2000) + 2000);
        break;
      case 'Policies':
        number = Math.floor(Math.random() * (2500 - 1000) + 1000);
        break;
      default:
        number = Math.floor(Math.random() * (3500 - 1500) + 1500);
      }

      data.push(number);
    }

    datasets.push({
      label, data
    });
  }

  const chartData = {
    title: T(activity, 'Page Views'),
    link: generator.detailUrl(),
    linkLabel: T(activity, 'All Data'),
    chart: {
      configuration: {
        data: {},
        options: {
          title: {
            display: true,
            text: T(activity, 'Page Views')
          }
        }
      },
      template: 'barStacked'
    },
    _settings: {}
  };

  chartData.chart.configuration.data.labels = categories;
  chartData.chart.configuration.data.datasets = datasets;

  return chartData;
}
