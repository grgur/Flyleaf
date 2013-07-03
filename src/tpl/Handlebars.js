/**
 * todo: Goal to support:
 * √ -.template
 * √ Handlebars
 * Mustache
 * dust.js
 * 
 */
Fly.def('Fly.tpl.Handlebars', {
    extend : 'Fly.tpl.Abstract',

    /**
     * @config precompiled
     * Supply with a pre-compiled template to skip compilation
     */
    precompiled : false,

    init : function () {
        var me = this;
        me.callParent('init', arguments, me);

        me.engine = Handlebars;
    },

    compile : function (tpl) {
        var me = this;

        if (me.precompiled) {
            return me.precompiled;
        }

        if (!tpl) {
            tpl = me.tpl;
        }

        me.compiled = Handlebars.compile(tpl);

        return me.compiled;
    }
});