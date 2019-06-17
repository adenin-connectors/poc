'use strict';
const generator = require('./common/generator');
const shared = require('./common/shared');

module.exports = async (activity) => {
  try {
    const action = $.getObjPath(activity.Request, 'Query.action');

    if (action === 'approve' || action === 'decline') {
      activity.Response.Data = {
        success: true
      };

      return;
    }

    let items = [
      {
        id: "1054889",
        title: `PTO Request`,
        link: generator.detailUrl()
      },
      {
        id: "1054891",
        title: `Purchase Request`,
        link: generator.detailUrl()
      },
      {
        id: "1054878",
        title: `Feedback`,
        link: generator.detailUrl()
      },
      {
        id: "1054880",
        title: `Requirement to hire`,
        link: generator.detailUrl()
      }
    ];

    let sortedItems = shared.getItemsBasedOnHour(activity, items);

    var dateRange = $.dateRange(activity, "today");
    let filteredItems = shared.filterItemsByDateRange(sortedItems, dateRange);
    let value = filteredItems.length;
    
    const pagination = $.pagination(activity);
    let paginatedItems = shared.paginateItems(filteredItems, pagination);

    activity.Response.Data.items = paginatedItems;
    activity.Response.Data.title = T(activity, 'My Approvals');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'All Approvals');
    activity.Response.Data.actionable = value>0;
    if(value>0){
      activity.Response.Data.value = value;
      activity.Response.Data.color = 'blue';
      activity.Response.Data.description = value > 1 ? T(activity, "You have {0} approvals.", value) : T(activity, "You have 1 approval.");
    }else {
      activity.Response.Data.description = T(activity, `You have no approvals.`);
    }

  } catch (error) {
    $.handleError(activity, error);
  }
};