$.extend(Fly, {
    /**
     * Create a custom namespace. Allows deep creation
     * @param {String} ns Namespace to create
     * @param {Mixed} value Value to apply to the newely created reference
     */
    ns : function (ns, value) {
        if (!F.isString(ns)) {
            throw new Error("Invalid namespace, must be a string");
        }

        //if NS already exists, return it
        if (nsCache.hasOwnProperty(ns)) {
            return nsCache[ns];
        }

        var parts = ns.split('.'),
            last = parts.length - 1,
            lastNs = parts[last],
            parent = window,
            part,
            obj,
            i;

        if (last > 0) {
            for (i = 0; i < last; i += 1) {
                part = parts[i];
                obj = parent[part];
                if (!F.isObject(obj)) {
                    parent[part] = {};
                }
                parent = parent[part];
            }
        }

        parent[lastNs] = parent[lastNs] || value;
        parent = parent[lastNs];

        nsCache[ns] = parent;

        return parent;
    },

    /**
     * Define a new Class
     * @param {String} ns Namespace for the class. Will be automatically created.
     * @param {Object} config Default key value pairs for the new Class. Think of it as the prototype (but it's not)
     * @returns {Object/Function} Newly created Class
     */
    def : function (ns, config) {
        var Base = Fly.BaseClass || {},
            Extend = config && config.extend ? Fly.ns(config.extend) : Base,
            Class;

        if (!F.isObject(config)) {
            config = {};
        }

        // @debug

        if (F.isFunction(Extend)) {
            Class = F.protoInherit(Extend, config);
            Class.prototype.$super = Extend;
            Class.prototype.$className = ns;
        }

        else {
            Class = $.extend(F.objCreate(Extend), config);
            Class.$super = Extend;
            Class.$className = ns;
        }

        // --------

        Fly.ns(ns, Class);

        if (Class.singleton === true) {
            Class.construct && Class.construct(config);
        }

        return Class;
    },

    /**
     * Instantiate and initialize a class
     * @param {String} name Class name
     * @param {Object} cfg Configuration to apply and override the Class defaults
     */
    init : function (name, cfg) {
        var cls,
            instance;

        if (!F.isObject(name)) {
            if (!F.isString(name) || name.length < 1) {
                return F.error("Invalid class name '" + name.toString() + "' specified, must be a non-empty string");
            }

            cls = F.getClass(name);
        } else {
            cls = name;
        }

        if (!cls) {
            return F.error("Cannot create an instance of unrecognized class name: " + name.toString());
        }

        if (cls.singleton) {
            return F.error("Cannot instantiate singleton " + name);
        }

        instance = F.objCreate(cls);

        if (F.isFunction(instance.construct)) {
            instance.construct(cfg);
        }

        return instance;
    },

    /**
     * Find a reference by it's full or partial name
     * Will search for (in this order):
     *  1. Entered name
     *  2. App namespace + name (e.g. MyApp.someName)
     *  3. Fly namespace + name (e.g. Fly.someName)
     *  4. App view + name (e.g. MyApp.view.someName)
     *  5. Fly view + name (e..g Fly.view.someName)
     *  6. App + name (App.someName)
     *  7. Undefined if none of the above is found
     *
     * Example:
     *      Fly.def('MyApp.view.ContactList', extend: 'Fly.view.List');
     *
     *      Fly.getClass('ContactList'); //returns MyApp.view.ContactList
     *      Fly.getClass('List'); //returns Fly.view.List
     *
     * @param name
     * @returns {*}
     */
    getClass: function (name) {
        var appName = Fly.App.name;

        return Fly.ns(name) ||
                (appName ? Fly.ns(appName + "." + name) : false) ||
                Fly.ns('Fly.' + name) ||
                (appName ? Fly.ns(appName + ".view." + name) : false) ||
                Fly.ns('Fly.view.' + name) ||
                Fly.ns('App.' + name);
    }
});