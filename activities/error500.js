'use strict';

module.exports = async (activity) => {
  try {
    activity.Response.ErrorCode = 500;
    activity.Response.Data = {
      ErrorText: 'Request intentionally failed'
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};
