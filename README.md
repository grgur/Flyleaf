Flyleaf
=======
>*Modern MVC framework for object oriented jQuery and Backbone enabled web app development*

Flyleaf is a featherlite object oriented approach to writing browser and device agnostic web applications. It introduces Sencha-like architecture to jQuery and Backbone. 

Flyleaf brings these hard to resist features on the table:

  - Full MVC stack
  - Modern class system
  - Object oriented development  
  - Grain of magic

Cool beans
----------
 - Object.create based inheritance *(fast)*, falls back to prototypal for non-ES5 dinosaurs
 - Mixins enabled
 - Inheritable singletons *(who needs a whole class for a single instance?)*
 - Unifrom event system for Views and DOM
 - Pseudo threading (w/ timer manager) pushes lower priority work to the end of stack *(means speed)*
 - Custom logging and error handling that can be globally turned on or off
 - Employs jQuery or underscore methods as [jsperf]'d proved fastest
 - Works on mobile and desktop, from IE6 onwards
 - No skinning, use CSS or SCSS per your likings
 - Minimum DOM in Views = **very fast**
 - Component manager
 - View query system, analogous to Ext.ComponentQuery (much simpler, though)
 - 6kb compressed and minified *(61kb with jQuery, Backbone,Handlebars, and Hammer.js)*
 - 'use strict';
 - JSLint-free
 - Compatible with Node.js *(woot!)*
 - Highly customizable, extensible, pluggable

Dependencies
-----------

Flyleaf depends on these awesome products

* [jQuery] - DOM manipulation. Works with 1.7+ (including 2.x)
* [Backbone] - MV* framework. Models, Collection, Events, and Underscore are utilized

Both pre-baked and standalone builds of Flyleaf are available for your convenience

Also included, but not dependent on
-----------
While flyleaf can function solely with Backbone and jQuery, additional libraries are introduced to provide with often needed features
* [Grunt] - Project builder
* [Handlebars] - Templating engine
* [Hammer.js] - Touch events recognizer

FAQ
--------
**Where does all the speed come from?**
First of all, Flyleaf utilizes a modern object inheritance system, supported on most modern browsers. Many object oriented frameworks are still stuck with prototypal inheritance. The latter is slower on many levels. 

Also, with pseudo threading, Flyleaf was able to make the browser much more responsive while expensive computations and communications (such as template compilation or DOM element rendering) are batched and executed as soon as the browser becomes available again. E.g. when the only real thread is freed up. This ensures lightning fast bootstrap and DOM manipulations.

Most common operations were heavily benchmarked before being introduced. For example, grep() vs each() vs map() vs for loop are evaluated and used in accordance to the best performance benefit without compromising flexibility. As another example, we reuse arrays when possible instead of reinitializing new memory blocks. You see how far we're going to squeeze out some cycles from clients' browsers?

There are numerous other JavaScript development patterns used in this project that are known to preserve memory, minimize garbage collection, lessen object iteration, improve DOM speed, and so on.

If you feel you have insights that can help this project become better, please contribute :)

**Which templating engines are supported?**
Virtually any that support the compilation phase, such as Handlebars, Mustache, _.template. Support for these two is already baked in. An abstract class is provided to help provide support to others. 

**Why Sencha-like?**
Ext JS and Sencha Touch are fabulous frameorks for developing desktop and mobile web applications, respectfully. It's hard to single anything out, but the development workflow is certainly amongst the stellar features for both frameworks. Experience generated with the two drove the idea behind Flyleaf. 

If you are a jQuery developer who ever wanted to develop a web app, you must have felt the need for a clean architecture to follow. Ever desired for modular development, object oriented approach, powerful class system? Here it is :)

**What makes it Sencha-like?**
These features are influenced by Ext and Sencha Touch but the end result is not really the same. Many have been improved for easier and faster developement. 

- Application concept
- Sencha Touch-like controllers
- Models and Stores (Collections)
- Component and Container
- Class system
- Base Class
- Component manager
- Component query
- Mixins
- Singletons
- Error handling
- Event system
- Error handling
- DOM node caching - ``cloneNode(true)`` FTW

**What's missing from Ext?**

- Layouts
- Widgets
- Theming
- Advanced component queries
- Heavy abstraction
- Draw and charting
- Soft scroller (Touch)
- Ext.Direct
- Loader and dependency management (you are welcome to use RequireJS)


**OK, I'm an Ext developer, what's been improved?**
For example:

- Component and Container merged together
- Instantiate App.view.Toolbar simply by issuing ``Fly.init('Toolbar')`` - everything else is magic. Looks up in the Application namespace and the framework namespace
- No need for XTypes (see the previous bullet ^^)
- Controllers can control (listen events for) both Views and DOM nodes
- Controllers are singletons. No need for a class and an instance when a single object is sufficient
- Views only come with a single DOM node. Add your own CSS class to it as they are not skinned (yep, you run the party). Even better, you can use [Zurb Foundation][1] or similar
- Strict mode
- Smaller featureset = smaller overhead
- License

Ext JS and Sencha are both fantastic. So are jQuery and Backbone. It's not that easy to find space for improvements in either, wouldn't you agree? If you've got ideas, good or bad, pass them on!

Current state
-----
Beta. **You** can help! Play with it, test, develop, contribute. Share. 
*Source code will be released within a few days from this very visit.*

License
--------
*Do-whatever-the heck-you-want-with Software License!*
(Actually MIT Licensed)

  
  [1]: http://foundation.zurb.com/
  [jQuery]: http://jquery.com
  [Backbone]: http://backbone.com
  [Grunt]: http://gruntjs.com
  [Handlebars]: http://handlebarsjs.com
  [Hammer.js]: http://eightmedia.github.io/hammer.js/
  [jsperf]: http://jsperf.com
  
