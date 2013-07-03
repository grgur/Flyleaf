define([
    'intern!object',
    'intern/chai!assert',
    'intern/chai!expect',
    '../../build/libs.js',
    '../../build/fly.js'
], function (registerSuite, assert, Fly) {
    var request,
        url = 'https://github.com/theintern/intern';

    registerSuite({
        name                      : 'demo',

        // before the suite starts
        setup                     : function () {
//            request = new Request();
        },

        // before each test executes
        beforeEach                : function () {
//            request.reset();
        },

        // after the suite is done
        teardown                  : function () {
//            request.cleanup();

//            if (!request.cleaned) {
//                throw new Error('Request should have been cleaned up after suite execution.');
//            }
        },

        // asynchronous test for Promises/A-based interfaces
        '#getUrl (async)'         : function () {

            // `getUrl` returns a promise
//            return request.getUrl(url).then(function (result) {
//                assert.equal(result.url, url, 'Result URL should be requested URL');
//                assert.isTrue(result.data.indexOf('next-generation') > -1, 'Result data should contain term "next-generation"');
//            });
        }
    });
});