'use strict';
module.exports = async (activity) => {

  try {

    if (!activity.Context.connector.custom1 || (activity.Context.connector.custom1 != activity.Request.Headers.secret)) {
      activity.Response.ErrorCode = 403;
      activity.Response.Data = {
        ErrorText: "Invalid Webhook Secret"
      };
      return;
    }

    const request = activity.Request.Data;
    let entity = {};
    let collections = [];
    if (request._type) {
      let date = new Date(request.date).toISOString();
      entity = {
        _type: request._type.trim(),
        id: "" + request.id.trim(),
        title: request.title.trim(),
        description: request.description.trim(),
        date: date.trim(),
        link: request.link.trim()
      };

      let assignedTo = request.assignedto.split(',').map(assignee => assignee.trim());
      let roles = request.roles.split(',').map(role => role.trim());

      if (assignedTo.length > 0 || roles.length > 0) {
        // case 1: A collection "all" is returned with users and roles
        collections.push({ name: "all", users: assignedTo, roles: roles, date: date });
        let done = request.done != "";
        if (!done) {
          // case 2: When open == true we return collection “open”, with users and roles
          collections.push({ name: "open", users: assignedTo, roles: roles, date: date });

          // case 3: When AssignedTo is not empty and open we return a collection “my”, with only users: AssignedTo
          // if assignedTo is empty we use roles instead
          if (assignedTo.length > 0) {
            collections.push({ name: "my", users: assignedTo, roles: [], date: date });
          } else {
            collections.push({ name: "my", users: [], roles: roles, date: date });
          }

          if (request.dueDate) {
            let dueDate = new Date(request.dueDate).toISOString();

            // case 4: When DueDate is provided and open we return a collection “due”, with users and roles; date = DueDate
            collections.push({ name: "due", users: request.assignedTo, roles: roles, date: dueDate });

            // case 5: When DueDate is provided and open we return a collection “my-due”, with only users: AssignedTo, date = DueDate
            // if assignedTo is empty we use roles
            if (request.assignedTo.length > 1) {
              collections.push({ name: "my-due", users: request.assignedTo, roles: [], date: dueDate });
            } else {
              collections.push({ name: "my-due", users: [], roles: roles, date: dueDate });
            }
          }
        }
      }
    }

    activity.Response.Data = { entity: entity, collections: collections };
  } catch (error) {
    $.handleError(activity, error);
  }
};
