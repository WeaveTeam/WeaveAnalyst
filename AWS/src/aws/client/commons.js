goog.provide('aws.client');
/**
 * @typedef {{
 * 	name: string,
 *  pass: string,
 *  folderName: string,
 *  connectionString: string,
 *  is_superuser: boolean
 * }}
 */
aws.client.ConnectionInfo;

/**
 * @typedef {{
 * 	id: number,
 *  title: String,
 *  numChildren: number
 * }}
 */
aws.client.EntityHierarchyInfo;


/**
 * @typedef {{
 * 	id: number,
 *  publicMetadata: Object,
 *  privateMetadata: Object
 * }}
 */
aws.client.DataEntity;


/**
 * This function is a wrapper for making a request to a JSON RPC servlet
 * 
 * @param {string} url
 * @param {string} method The method name to be passed to the servlet
 * @param {Array.<Object>} params An array of object to be passed as parameters to the method 
 * @param {Function} resultHandler A callback function that handles the servlet result
 * @param {number=}queryId
 */
aws.client.queryService = function(url, method, params, resultHandler, queryId)
{
    var request = {
        jsonrpc: "2.0",
        id: queryId || "no_id",
        method: method,
        params: params
    };
    $.post(url, JSON.stringify(request), handleResponse, "json");

    function handleResponse(response)
    {
        if (response.error)
            alert(JSON.stringify(response, null, 3));
        else if (resultHandler)
            resultHandler(response.result, queryId);
    }
};