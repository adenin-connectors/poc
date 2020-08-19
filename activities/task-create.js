'use strict';
const faker = require('faker');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

module.exports = async (activity) => {

  try {
    var data = {};

    // extract _action from Request
    var _action = getObjPath(activity.Request, "Data.model._action");
    if (_action) {
      activity.Request.Data.model._action = {};
    } else {
      _action = {};
    }

    switch (activity.Request.Path) {

      case "/create":
      case "/submit":
      case "create":
      case "submit":
        let randomId = faker.random.uuid();
        var comment = T(activity, "Task {0} created.", randomId);
        data = getObjPath(activity.Request, "Data.model");
        data._action = {
          response: {
            success: true,
            message: comment
          }
        };
        break;

      default:
        var fname = __dirname + path.sep + "common" + path.sep + "task-create.form";
        var schema = yaml.safeLoad(fs.readFileSync(fname, 'utf8'));

        data.title = T(activity, "Create Task");
        data.formSchema = schema;
        data.form = {};

        // initialize form subject with query parameter (if provided) -- V1 only had one entity in query
        if (activity.Request.Query && activity.Request.Query.query) {
          data.form.subject = activity.Request.Query.query;
        }

        // initialize form subject with product entity -- V2 has named entities 
        var subjectEntity = getObjPath(activity.Request,"Data.model._entities.subject");
        if(subjectEntity) data.form.subject = subjectEntity;
        
        data.formSchema = schema;

        // initialize form subject with query parameter (if provided)
        if (activity.Request.Query && activity.Request.Query.query) {
          data = {
            form: {
              subject: activity.Request.Query.query
            }
          }
        }

        data._actionList = [{
          id: "create",
          label: T(activity, "Create Task"),
          settings: {
            actionType: "a"
          }
        }];
        break;

    }

    // copy response data
    activity.Response.Data = data;

    activity.Response.Data._card = {
      type: 'form'
    };
  } catch (error) {
    // handle generic exception
    $.handleError(activity, error);
  }


  function getObjPath(obj, path) {

    if (!path) return obj;
    if (!obj) return null;

    var paths = path.split('.'),
      current = obj;

    for (var i = 0; i < paths.length; ++i) {
      if (current[paths[i]] == undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
  }
};
