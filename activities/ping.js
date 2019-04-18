'use strict';

module.exports = async (activity) => {
  try {
    activity.Response.Data = {
      success: true,
      welcome: T(activity, 'My name is {0} and I am from {1}.', 'Sam Adams', 'Boston')
    };
  } catch (error) {
    $.handleError(activity, error);
    activity.Response.Data.success = false;
  }
};
