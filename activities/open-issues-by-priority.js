'use strict';
const generator = require('./common/generator');

module.exports = async (activity) => {
  try {
    activity.Response.Data = generateChartData(activity);
    activity.Response.Data.title = T(activity, 'Issues');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Issues');
    activity.Response.Data._card = {
      type: 'chart'
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};

function generateChartData(activity) {
  let priorities = ["Low", "Normal", "Critical", "High", "No Priority"];
  let datasets = [];
  let data = [];

  for (let x = 0; x < priorities.length; x++) {
    let number = Math.floor(Math.random() * 10); 
    data.push(number);
  }

  datasets.push({ label: T(activity, 'Number Of Issues'), data });

  let chartData = {
    title: T(activity, 'Open Issues by Priority'),
    link:  generator.detailUrl(),
    linkLabel: T(activity, 'Go to Issues'),
    chart: {
      configuration: {
        data: {},
        options: {
          title: {
            display: true,
            text: T(activity, 'Issue Metrics By Priority')
          },
          plugins: {
            datalabels: {
              // 'display: true' MUST be added for datalabels to show, as default is false in our bundle
              display: true,
              // all other datalabels options can now be used, except those that take functions
              color: 'white',
              font: {
                weight: 'bold'
              }
            }
          }
        }
      },
      template: 'pie'
    },
    _settings: {}
  };
  chartData.chart.configuration.data.labels = priorities;
  chartData.chart.configuration.data.datasets = datasets;

  return chartData;
}