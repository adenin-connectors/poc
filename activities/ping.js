'use strict';

module.exports = async (activity) => {
  try {
    activity.Response.Data = {
      success: true
    };
  } catch (error) {
    $.handleError(activity, error);
    activity.Response.Data.success = false;
  }
};
