/**
 * Base Class manny other Flyleaf classes inherit from
 * It's the default Class to extend when creating a new Class
 * Not to be instantiated directly
 */
Fly.def('Fly.BaseClass', {
    /**
     * If true, the newly created class will be a singleton
     */
    singleton : false,


    /**
     * Default event listeners to initialize when instance is created.
     * Accepts both Class and DOM events
     *
     *  Example listener config
     *
     *      listeners: {
     *          tap: callbackFunction,
     *          beforeinit: otherFunction
     *      }
     *
     *  or
     *      listeners: {
     *          tap: {
     *              fn: callbackFunction,
     *              scope: this
     *          }
     *      }
     *
     */
    listeners: false,

    /**
     * Construct an instance
     * @param {Object} config Default configuration
     * @returns {Fly.BaseClass} me This class
     */
    construct : function (config) {
        var me = this;

        // Init mixins
        me.mixin(Fly.Events);

        // Init config
        me.initConfig(config);

        // Init listeners that exist in this.listeners object
        me.initListeners(me.listeners);

        // Fire the beforeinit event
        me.trigger('beforeinit', me, arguments);

        // If init exists as a method, call it
        // You can use init in classes that extend BaseClass as a bootstrap method
        if (me.init) {
            me.init(config, me);
        }
        return me;
    },

    //    init : function (cfg, me) {
    //          use your custom initialization sequence here
    //    },

    /**
     * A shorthand for calling the superclass method
     * @param {String} fn The name of the method to call
     * @param {Array} args Arguments to pass to the calling function (can be the arguments keyword)
     * @param {Object} scope Scope to run the parent method in
     * @returns {*}
     */
    callParent : function (fn, args, scope) {
        var sup = this.$super,
            inherited = this[fn],
            supFn = sup[fn];

        if (supFn === inherited) {
            return sup.callParent(fn, args, scope);
        }

        if (supFn) {
            supFn.apply(scope || this, args);
        }
    },

    /**
     * Initialize configuration
     * @param {Object} config Object to apply to the new instance
     */
    initConfig : function (config) {
        $.extend(this, config);
    },

    /**
     * Set up class listeners
     * @param {Object} listeners The listeners config object
     */
    initListeners : function (listeners) {
        var me = this,
            g = F.global;

        F.each(listeners, function (conf, event) {
            if (F.isObject(conf)) {
                me.on(event, conf.fn, conf.scope || g);
            } else {
                me.on(event, conf);
            }
        });
    },

    /**
     * Apply a single mixin
     */
    mixin : function () {
        var me = this,
            args = arraySlice.call(arguments),
            mixin,
            i,
            key;

        for (i = 0; i < args.length; i += 1) {
            mixin = args[i];
            for (key in mixin) {
                if (mixin.hasOwnProperty(key) && me[key] === undefined) {
                    me[key] = mixin[key];
                }
            }
            if (F.isFunction(mixin.init)) {
                mixin.init.call(me);
            }
        }
    }
});