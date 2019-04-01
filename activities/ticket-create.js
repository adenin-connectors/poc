'use strict';
const path = require('path');
const api = require('./common/api');
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

            case "create":
            case "submit":

                // ** api should be called here to create ticket **

                // return success status                
                var comment = T("Task created");
                data = getObjPath(activity.Request, "Data.model");
                data._action = {
                    response: {
                        success: true,
                        message: comment,
                        //datetime: response.body.start.dateTime
                    }
                };
                break;


            default:
                // load form schema
                var fname = __dirname + path.sep + "common" + path.sep + "ticket-create.form";
                var schema = yaml.safeLoad(fs.readFileSync(fname, 'utf8'));

                // return form schema
                data.formSchema = schema;

                // initialize form subject with query parameter (if provided)
                if (activity.Request.Query && activity.Request.Query.query) {
                    data.form.subject = activity.Request.Query.query;
                }

                break;
        }

        // copy response data
        activity.Response.Data = data;
        
    } catch (error) {
        // handle generic exception
        Activity.handleError(error);
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