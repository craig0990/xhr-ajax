# xhr-ajax (v2.0.0)

A small wrapper that depends on [XMLHttpRequest.js](http://github.com/ilinsky/xmlhttprequest). This library does _absolutely nothing_ except abstract `XMLHttpRequest `into a global `ajax` function similar to jQuery.

The inspiration for this library is that there doesn't appear to be a small, minimal XHR library that handles cross-browser AJAX requests without requring you to construct an `XMLHttpRequest` object each time.

Suggestions/improvements are more than welcome. A useful source of documentation is the [W3C XMLHttpRequest Working Draft](http://www.w3.org/TR/XMLHttpRequest/).

## How To Use

    <head>
        <script src="xhr-ajax.js"></script>
    </head>

Alternatively you may use it with an AMD loader such as RequireJS or as a traditional Node module (I can't imagine why you might want to, but you can). The only expectation is that an XMLHttpRequest object is available.

## Usage

`ajax(url, [options]) : Promise`

`url` is the request URL, including query parameters if any.

`options` is an optional object which may contain the following keys:

* `method` - a string representing the HTTP request method - defaults to `GET`
* `url` - the request URL (only used if `options` is the only argument)
* `headers` - an object of key-values representing HTTP request headers
* `data` - a string representing the HTTP request payload
* `async` - a boolean value - defaults to `true`
* `user` - a string representing the HTTP Basic Auth username
* `pass` - a string representing the HTTP Basic Auth password

The promise is resolved or rejected with the underlying `XMLHttpRequest` object.

### Request Data

This library does not provide any automatic serialisation - if you need to send JSON data in the request, you are
responsible for encoding it yourself beforehand.

## Examples

### GET request

	ajax('/api/users?from=50&to=100', {
    	headers: {
        	'X-Custom-Auth-Header': '1234'
        }
    }).then(function(xhr) {
        console.log('Got users', JSON.parse(xhr.responseText));
    }, function(xhr) {
        console.error('Users API returned', xhr.status, xhr.statusText);
        console.log(xhr);
    });

### POST request

	ajax('/api/users', {
    	method: 'POST',
        headers: {
        	'X-Custom-Auth-Header': '1234',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            name: 'John Doe'
        })
    }).then(function(xhr) {
        console.log('Got response', JSON.parse(xhr.responseText));
    }, function(xhr) {
        console.error('Users API returned', xhr.status, xhr.statusText);
        console.log(xhr);
    });

## Project Status

This library is not _actively_ maintained, but I will happily accept pull
requests and do my best to fix any bug reports.

## License

Licensed under the MIT license. See the [LICENSE](./LICENSE.md) file for more information.
