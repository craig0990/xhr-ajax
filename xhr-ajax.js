/**
* xhr-ajax.js Copyright (C) 2013 Craig Roberts (http://craig0990.co.uk)
*
* Licensed under the MIT License (http://mit-license.org)
*/
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.ajax = factory();
  }
}(this, function () {

    /**
     * @param {String}  url                  The URL to request
     * @param {Object}  [options]            Options to apply:
     * @param {String}  [options.url]        The URL to request
     * @param {String}  [options.method=GET] The HTTP method to use
     * @param {Boolean} [options.async=true] Whether to call asynchronously
     * @param {String}  [options.user]       Username for authenticated requests
     * @param {String}  [options.password]   Password for authenticated requests
     * @param {Object}  [options.headers]    HTTP Request headers, where keys are header fields
     * @param {*}       [options.data]       Request data - passed directly to `send()`
     *
     * @returns {Promise}
     */
    function ajax(url, options) {
        if (typeof url == 'undefined') {
            throw new TypeError('A URL is required for xhr-ajax');
        }

        if (typeof options === 'undefined' && typeof url === 'object' && url.url) {
            options = url;
            url = options.url;
        } else if (typeof url !== 'string') {
            throw new TypeError('Options must be an object for xhr-ajax');
        }

        options = options || {};

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open(
                options.method || 'GET',
                url,
                typeof options.async === 'undefined' ? true : options.async,
                options.user,
                options.password
            );

            Object.keys(options.headers || {}).forEach(function(name) {
                xhr.setRequestHeader(name, options.headers[name]);
            });

            xhr.onreadystatechange = function() {
                if (this.readyState !== 4) {
                    return;
                }

                if (this.status === 200) {
                    resolve(xhr);
                } else {
                    reject(xhr);
                }
            };

            xhr.send(options.data);
        });
    }

    return ajax;
}));
