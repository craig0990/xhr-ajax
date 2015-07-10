QUnit.module('xhr-ajax', {
    setup: function() {
        this.orig = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            this.open = function() {};
            this.send = function() {};
        };
    },
    teardown: function() {
        window.XMLHttpRequest = this.orig;
    }
});

QUnit.test('Constructor throws a TypeError with no arguments', function(assert) {
    assert.throws(function() {
        ajax();
    }, TypeError, 'TypeError thrown');
});

QUnit.test('Constructor returns a Promise', function(assert) {
    var request = ajax('example');
    assert.ok(request instanceof Promise, 'Promise instance returned');
});

QUnit.test('Constructor throws a TypeError without options.url', function(assert) {
    assert.throws(function() {
        ajax({});
    }, TypeError, 'TypeError thrown');
});

QUnit.test('Constructor accepts an options object', function(assert) {
    var request = ajax({
        url: 'example'
    });
    assert.ok(request instanceof Promise, 'Promise instance returned');
});

QUnit.test('Open receives all relevant options', function(assert) {
    var done = assert.async();
    window.XMLHttpRequest = function() {
        this.open = function(method, url, async, user, pass) {
            assert.strictEqual(method, 'POST', 'Method is POST');
            assert.strictEqual(url, 'example', 'URL is "example"');
            assert.strictEqual(async, false, 'async is false');
            assert.strictEqual(user, 'admin', 'user is "admin"');
            assert.strictEqual(pass, 'admin', 'pass is "admin"');
            done();
        };
        this.send = function() {};
    };

    var request = ajax({
        url: 'example',
        method: 'POST',
        async: false,
        user: 'admin',
        password: 'admin'
    });
});

QUnit.test('Send receives data', function(assert) {
    var done = assert.async();
    window.XMLHttpRequest = function() {
        this.open = function() {};
        this.send = function(data) {
            assert.strictEqual(data, 'MYDATA', 'Data is "MYDATA"');
            done();
        };
    };

    var request = ajax({
        url: 'example',
        data: 'MYDATA'
    });
});

QUnit.test('Headers are set via options.headers', function(assert) {
    var done = assert.async();
    window.XMLHttpRequest = function() {
        this.open = function() {};
        this.send = function() {};
        this.setRequestHeader = function(name, value) {
            assert.strictEqual(name, 'X-Example', 'Header name is "X-Example"');
            assert.strictEqual(value, 'MYHEADERVALUE', 'Header value is "MYHEADERVALUE"');
            done();
        };
    };

    var request = ajax({
        url: 'example',
        headers: {
            'X-Example': 'MYHEADERVALUE'
        }
    });
});

QUnit.test('Promise is resolved on state change with status code of 200', function(assert) {
    var done = assert.async();
    window.XMLHttpRequest = function() {
        var self = this;
        this.open = function() {};
        this.send = function() {
            self.readyState = 4;
            self.status = 200;
            self.responseText = 'RESPONSETEXT';
            self.onreadystatechange();
        };
    };

    ajax({
        url: 'example'
    }).then(function(xhr) {
        assert.strictEqual(xhr.responseText, 'RESPONSETEXT', 'responseText is "RESPONSETEXT"');
        done();
    });
});

QUnit.test('Promise is rejected on state change with non-200 status code', function(assert) {
    var done = assert.async();
    window.XMLHttpRequest = function() {
        var self = this;
        this.open = function() {};
        this.send = function() {
            self.readyState = 4;
            self.status = 404;
            self.responseText = 'RESPONSETEXT';
            self.onreadystatechange();
        };
    };

    ajax({
        url: 'example'
    }).then(null, function(xhr) {
        assert.strictEqual(xhr.responseText, 'RESPONSETEXT', 'responseText is "RESPONSETEXT"');
        done();
    });
});
