'use strict';

module.exports = async () => {
  try {
    Activity.Response.ErrorCode = 500;
    Activity.Response.Data = {
      ErrorText: 'Request intentionally failed'
    };
  } catch (error) {
    Activity.handleError(error);
  }
};
