# xhr-ajax (v1.0.0)

A small wrapper that depends on [XMLHttpRequest.js](http://github.com/ilinsky/xmlhttprequest). This library does _absolutely nothing_ except abstract `XMLHttpRequest `into a global `ajax` function similar to jQuery.

The inspiration for this library is that there doesn't appear to be a small, minimal XHR library that handles cross-browser AJAX requests without requring you to construct an `XMLHttpRequest` object each time.

Suggestions/improvements are more than welcome. A useful source of documentation is the [W3C XMLHttpRequest Working Draft](http://www.w3.org/TR/XMLHttpRequest/).

## How To Use

    <head>
        <script src="xhr-ajax.js"></script>
    </head>

Alternatively you may use it with an AMD loader such as RequireJS or as a traditional Node module (I can't imagine why you might want to, but you can). The only expectation is that an XMLHttpRequest object is available.

## Usage

`ajax(url, [options])`

`url` is the request URL, including query parameters if any.

`options` is an optional object which may contain the following keys:

* `method` - a string representing the HTTP request method - defaults to `GET`
* `headers` - an object of key-values representing HTTP request headers
* `data` - a string representing the HTTP request payload
* `async` - a boolean value - defaults to `true`
* `success` - a success callback (where the response status equals `200`) which accepts `response` and `xhr` as parameters
* `error` - an error callback (where the response status does not equal `200`) which accepts `status`, `statusText` and `xhr` as parameters

The `success` and `error` callbacks receive the underlying [`XMLHttpRequest`](http://www.w3.org/TR/XMLHttpRequest/) object as their final argument.

## Examples

### GET request

	ajax('/api/users?from=50&to=100', {
    	headers: {
        	'X-Custom-Auth-Header': '1234'
        },
        success: function(response, xhr) {
        	console.log('Got users', JSON.parse(response));
        },
        error: function(status, message, xhr) {
        	console.error('Users API returned', status, message);
            console.log(xhr);
        }
    });

### POST request

	ajax('/api/users', {
    	method: 'POST',
        headers: {
        	'X-Custom-Auth-Header': '1234',
            'Content-Type'
        },
        success: function(response, xhr) {
        	var data = JSON.parse(response);
        	console.log('Created user', data.id);
            console.log('Response headers', xhr.getAllResponseHeaders());
        },
        error: function(status, message, xhr) {
        	var data = JSON.parse(xhr.responseText);
        	console.error('Users API returned', status, message, 'with data', data);
            console.log('Response headers', xhr.getAllResponseHeaders());
        }
    });
