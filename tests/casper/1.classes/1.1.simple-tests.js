casper.test.info('Class system');

// Define a class without passing the config object
Fly.def('App.MyClassNoConfig');
//casper.test.assertType(App.MyClassNoConfig, "function", "App.MyClassNoConfig constructor (without config) was created");

// Define a class with an empty config object
Fly.def('App.MyClassEmptyConfig', {});
//casper.test.assertType(App.MyClassEmptyConfig, "function", "App.MyClassEmptyConfig constructor (with empty config obj) was created");

// Define a class with two parameters
Fly.def('App.MyClass', {
    foo: 1,
    bar: 'test'
});
//casper.test.assertType(App.MyClass, "function", "App.MyClass constructor was created");

// Is prototype working?
//casper.test.assertEquals(App.MyClass.prototype.foo, 1, "Prototype foo is 1");
casper.test.assertEquals(App.MyClass.foo, 1, "'Prototype' foo is 1");
//casper.test.assertEquals(App.MyClass.prototype.bar, "test", "Prototype bar is test");


// start creating instances
casper.test.info('Instances');

// Simple instance without overriding anything
var instanceMyClass = Fly.init('App.MyClass');

// Is prototype applied
casper.test.assertEquals(instanceMyClass.foo, 1, "Instance foo is 1");

// Does instanceof work?
//casper.test.assert(instanceMyClass instanceof App.MyClass, "Instance is instance of class MyClass");
casper.test.assert(App.MyClass.isPrototypeOf(instanceMyClass), "Instance is instance of class MyClass");

// Instantiate without the leading "App." and override foo
var instanceMyClassShort = Fly.init('MyClass', {
    foo: 2,
    newConfigOption: true
});
casper.test.assertType(instanceMyClassShort, "object", "Fly.init works without referencing 'App.'");

// is foo applied?
casper.test.assertEquals(instanceMyClassShort.foo, 2, "Instance's foo is 2");

// is newConfigOption applied?
casper.test.assert(instanceMyClassShort.newConfigOption, "Instance's newConfigOption exists");

// Create a new class that extends App.MyClass
Fly.def('App.MyExtendedClass', {
    extend: 'App.MyClass',
    foo: 100
});

// Instantiate the extended class and test if the value of foo comes from MyExtendedClass.prototype
var instanceExtended = Fly.init('App.MyExtendedClass');
casper.test.assertEquals(instanceExtended.foo, 100, "Instance foo is 100");

// Is bar inherited?
casper.test.assertEquals(instanceExtended.bar, "test", "Instance bar is inherited");

// Will instanceof show the parent class?
//casper.test.assert(instanceExtended instanceof App.MyClass, "Instance is instance of the extended class (MyClass)");
casper.test.assert(App.MyClass.isPrototypeOf(instanceExtended), "Instance is instance of class MyClass");

// WIll instanceof also show BaseClass?
//casper.test.assert(instanceExtended instanceof Fly.BaseClass, "Instance is instance of the BaseClass");
casper.test.assert(Fly.BaseClass.isPrototypeOf(instanceExtended), "Instance is instance of class MyClass");

// Create an instance of the extended class and override foo prototype
var instanceExtendedOverride = Fly.init('App.MyExtendedClass', {foo: 101});
casper.test.assertEquals(instanceExtendedOverride.foo, 101, "Instance foo is 101");

//Deleting instance foo
casper.test.comment("Deleting instance foo");
delete instanceExtendedOverride.foo;
casper.test.assertEquals(instanceExtendedOverride.foo, 100, "Instance foo is 100 again");

//Deleting MyExtendedClass prototype foo
casper.test.comment("Deleting MyExtendedClass prototype foo");
delete App.MyExtendedClass.foo;
casper.test.assertEquals(instanceExtendedOverride.foo, 1, "Instance foo is 1 again");

//Deleting MyClass prototype foo
casper.test.comment("Deleting MyClass prototype foo");
delete App.MyClass.foo;
casper.test.assertEquals(instanceExtendedOverride.foo, undefined, "Instance foo is undefined");

casper.test.done();