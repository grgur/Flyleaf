/**
 * Abstract Template
 *
 * @event setdata
 * Fires when new data object has been set
 * @param {Fly.tpl.Abstract} me Template instance
 * @param {Object} data Data applied
 *
 * @event render
 * Fires when html is rendered from template
 * @param {Fly.tpl.Abstract} me Template instance
 * @param {String} html HTML string returned
 * @param {Object} data Data applied
 *
 * @event compile
 * Fires when template has compiled
 * @param {Fly.tpl.Abstract} me Template instance
 */
Fly.def('Fly.tpl.Abstract', {
    /**
     * @config
     * Template string
     */
    tpl : '',

    /**
     * @config
     * Data to apply to template
     */
    data : undefined,

    /**
     * @config autoRender
     * True to render on instantiation
     * Assumes {@link autoCompile} true
     */
    autoRender : false,

    /**
     * @config autoCompile
     * True to compile the template immediately on instantiation
     */
    autoCompile : false,

    /**
     * @config compileDeferred
     * True to kick compilation out of the execution loop.
     * Useful when template is not used immediately
     * Uses timers to compile when browser turns idle
     * Make sure your code is evented in this case
     */
    compileDeferred : false,

    /**
     * @property
     * Rendered HTML string
     */
    html : undefined,

    /**
     * @property
     * Template engine to use
     * Examples: Handlebars, _.template
     */
    engine : undefined,

    /**
     * @private
     * Compiled template. Result of this.compile()
     */
    compiled : undefined,

    /**
     * Abstract method, replace with a real compile function
     */
    compile : Fly.emptyFn,

    init : function (cfg) {
        var me = this;

        if (me.compileDeferred) {
            return Fly.thread(function () {
                me.doCompile();
                me.initTpl();
            });
        }

        if (me.autoRender === true || me.autoCompile === true) {
            me.doCompile();
        }

        me.initTpl();
    },

    /**
     * @private
     * Normalize data and render if applicable
     */
    initTpl : function () {
        var me = this;

        if (me.data) {
            me.setData(me.data, me.autoRender);
        }
    },

    /**
     * Set data and optionally render
     * @param {Object} data Data to apply
     * @param {Boolean} render True to render immediately and return rendered string
     * @returns {Object/String} Data set or HTML rendered
     */
    setData : function (data, render) {
        var me = this,
            parsedData;

        if (F.isFunction(me.applyData)) {
            data = me.applyData(data);
            if (data === false) {
                return data;
            }
        }

        me.data = data;

        me.trigger('setdata', me, data);

        if (render) {
            parsedData = Fly.isCollection(data) ?
                    data.map(function (model) {var obj = model.toJSON(); obj["modelId"] = model.cid; return obj; }) :
                    data;

            return me.render(parsedData);
        }

        return data;
    },

    /**
     * Apply data to template and return parsed string
     * @param {Object} data Optionally pass data to render. Skips setting the value to this.data
     * @returns {String} html Rendered string
     */
    render : function (data) {
        var me = this;

        if (!me.compiled) {
            me.doCompile();
        }

        if (!data) {
            data = me.data;
        }
        me.html = me.compiled(data);

        me.trigger('render', me, me.html, data);

        return me.html;
    },

    /**
     * Compilation sequence
     */
    doCompile : function () {
        var me = this;
        me.compile();
        me.trigger('compile', me);
    }

    /**
     * @method applyData
     * Use this method to normalize data. Received passed data and is expected to return it normalized.
     * Return false to abort
     * Only used if exists
     */
});