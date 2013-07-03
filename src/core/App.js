Fly.def('Fly.App', {
    singleton   : true,
    name        : undefined,
    views       : {},
    models      : {},
    stores      : {},
    controllers : {},
    setup       : function (conf) {
        var me = this,
            appName = conf.name;

        $.extend(me, conf);

        if (!F.isString(appName) || !appName.length) {
            appName = 'App';
        }

        F.ns(appName + ".app", me);

        if ($.isFunction(me.launch)) {
            $($.proxy(me.launch, me));
        }

        me.name = appName;
    },

    launch : undefined
});