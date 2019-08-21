'use strict';

module.exports = async (activity) => {
  try {
    activity.Response.ErrorCode = 461;
    activity.Response.Data = {
      ErrorText: 'Unauthenticated'
    };
  } catch (error) {
    $.handleError(activity, error);
  }
};