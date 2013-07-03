Fly.def('Fly.BaseClass', {
    singleton : false,

    construct : function (config) {
        var me = this;

        me.mixin(Fly.Events);

        me.initConfig(config);
        me.initListeners(me.listeners);

        me.trigger('beforeinit', me, arguments);

        if (me.init) {
            me.init(config, me);
        }
        return me;
    },

    //    init : function (cfg, me) {
    // use your custom initialization sequence here
    //    },

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

    initConfig : function (config) {
        $.extend(this, config);
    },

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