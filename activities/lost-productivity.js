'use strict';

const generator = require('./common/generator');

module.exports = async (activity) => {
  try {
    activity.Response.Data = {
      title: 'Business Activities',
      description: 'Analyze lost productivity from common business activities.',
      link: generator.detailUrl(),
      linkLabel: 'Open Dashboard',
      thumbnail: 'https://www.adenin.com/assets/images/wp-images/logo/new-relic.svg',
      chart: {
        configuration: {
          data: {
            labels: [
              'Search SAP',
              'SharePoint - Open Item',
              'SharePoint - Save Item',
              'Launch BranchPortal',
              'Launch OneNote',
              'SharePoint - Open Folder',
              'Outlook - Send Mail',
              'Sharepoint - Open Dialog'
            ],
            datasets: [{
              label: 'Lost Productivity ($)',
              data: [16, 9, 7, 7, 7, 5, 3, 3]
            }]
          },
          options: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 0
              }
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
            }
          }
        },
        template: 'horizontalBar',
        palette: 'office.BlueII6'
      }
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};
