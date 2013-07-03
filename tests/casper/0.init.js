casper.test.info('See if everything loaded');
casper.test.assertType(jQuery, "function", "jQuery loaded");
casper.test.assertType(Fly, "object", "Fly loaded");

casper.test.done();