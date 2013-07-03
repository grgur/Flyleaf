/**
 * casperjs test --includes=build/fly-all.min.js tests/casper/
 */

casper.test.info('Namespacing');

Fly.ns('App.namespace.Cls');

casper.test.assertType(App, "object", "App created");
casper.test.assertType(App.namespace, "object", "Package App.namespace created");
casper.test.assertType(App.namespace.Cls, "undefined", "App.namespace.Cls created");

casper.test.done();

