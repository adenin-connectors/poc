'use strict';

const generator = require('./common/generator');

module.exports = async (activity) => {
  try {
    activity.Response.Data = {
      title: 'Enterprise Applications',
      description: 'Analyze activity across enterprise applications.',
      link: generator.detailUrl(),
      linkLabel: 'Open Dashboard',
      thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/new-relic.svg',
      _card: {
        type: 'chart'
      },
      chart: {
        configuration: {
          data: {
            labels: [
              'SAP',
              'Order Execution',
              'BranchPortal',
              'Microsoft Word',
              'Time and Expense',
              'Microsoft Sharepoint',
              'Salesforce',
              'Microsoft OneNote',
              'Skype for Business/Lync'
            ],
            datasets: [
              {
                data: [46.8, 25.8, 3.8, 12.5, 4.9, 5, 4.5, 0, 3]
              },
              {
                data: [0.8, 0, 15, 0, 10, 11.5, 10, 12.9, 2.6]
              },
              {
                data: [52.4, 74.2, 81.2, 87.5, 85.1, 83.5, 85.5, 87.1, 94.4]
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: false
              }]
            },
            layout: {
              padding: {
                left: 25,
                right: 25,
                top: 0,
                bottom: 25
              }
            },
            title: {
              display: true,
              text: 'Activity Status (%)'
            }
          }
        },
        template: 'horizontalBarStacked',
        palette: 'brewer.RdYlGn4'
      }
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};
