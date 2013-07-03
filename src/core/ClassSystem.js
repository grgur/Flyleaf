$.extend(Fly, {
    /**
     * Create a custom namespace. Allows deep creation
     * @param {String} ns
     * @param {Object} value
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
     * Define a new class
     * @
     */
    def : function (ns, config) {
        var Base = Fly.BaseClass || {},
            Extend = config && config.extend ? Fly.ns(config.extend) : Base,
            Class;

        if (!F.isObject(config)) {
            config = {};
        }

        Class = $.extend(F.objCreate(Extend), config);
        Class.$super = Extend;
        Class.$className = ns;

        Fly.ns(ns, Class);

        if (Class.singleton === true) {
            Class.construct && Class.construct(config);
            Class.init && Class.init(config);
        }

        return Class;
    },

    /**
     * Instantiate and initialize a class
     * @param {String} name
     * @param {Object} cfg
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