const api = require('./common/hrapi');

module.exports = async function (activity) {

    try {              
        var pagination = Activity.pagination();        
        
        let url = "/?seed=adenin";
        url += "&page=" + pagination.page;
        url += "&results=" + pagination.pageSize;
        url += "&inc=name,email,location,picture"

        const response = await api(url);
        if (Activity.isErrorResponse(response)) return;

        let items = response.body.results;

        for (let i = 0; i < items.length; i++) {
            let item = convert_item(items[i]);
            Activity.Response.Data.items.push(item);
        }

    } catch (error) {
        // handle generic exception
        Activity.handleError(error);
    }



    function convert_item(_item) {

        var item = {};

        // *todo* convert item as needed
        let id = _item.picture.large;
        id = id.substring(id.lastIndexOf("/") + 1); // extract id from image name
        item.id = id.substring(0, id.indexOf("."));

        item.title = _item.name.first + " " + _item.name.last;
        item.description = _item.email;
        item.picture = _item.picture.large;

        return item;
    }

};
