'use strict';
const api = require('./common/api');

module.exports = async function (activity) {

  try {
    activity.Response.Data = {
      success: true,
      welcome: T('My name is {0} and I am from {1}.', 'Sam Adams', 'Boston')
    };
  } catch (error) {
    Activity.handleError(error);
    activity.Response.Data.success = false;
  }
};
