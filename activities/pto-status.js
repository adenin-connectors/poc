'use strict';
const generator = require('./common/generator');

module.exports = async function (activity) {
  try {
    let value = 240 - Math.round((8 * new Date().getDate()) / 3);

    activity.Response.Data.title = T(activity, 'PTO Status');
    activity.Response.Data.link = generator.detailUrl();
    activity.Response.Data.linkLabel = T(activity, 'Request PTO');
    activity.Response.Data.actionable = value > 0;

    if (value > 0) {
      activity.Response.Data.value = value;
      activity.Response.Data.date = new Date().toISOString();
      activity.Response.Data.color = 'blue';
      activity.Response.Data.description = value > 1 ? T(activity, "Your current PTO balance is {0} hours.", value)
        : T(activity, "Your current PTO balance is 1 hour.");
    } else {
      activity.Response.Data.description = T(activity, `You don't have PTO balance.`);
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};