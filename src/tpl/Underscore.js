Fly.def('Fly.tpl.Underscore', {
    extend : 'Fly.tpl.Abstract',

    /**
     * @config likeExt
     * Use {var} and {[expression]} like in ExtJS and Sencha Touch
     */
    likeExt : false,

    init : function () {
        var me = this;
        me.callParent('init', arguments, me);

        if (me.likeExt) {
            me.lookLikeExtTpl();
        }

        me.engine = _.template;
    },

    compile : function (tpl) {
        var me = this;

        if (!tpl) {
            tpl = me.tpl;
        }

        me.compiled = _.template(tpl);

        return me.compiled;
    },

    lookLikeExtTpl : function () {
        _.templateSettings = {
            interpolate : /\{(.+?)\}/g,
            evaluate    : /\{\[(.+?)\]\}/g
        };
    }
});