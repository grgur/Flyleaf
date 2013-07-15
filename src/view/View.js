/**
 * Main View class.
 * Sets up all the defaults for newly created views.
 * A view can exist on it's own or canhave children
 */
Fly.def('Fly.view.View', {
    /**
     * Template string
     * Based on _.template
     * Variables in {}
     * Evaluate in {[]}
     *
     * Example
     * '<div>{name}</div>
     * '<div>{[for (i in obj) {print obj[i];}]}</div'>
     *
     */
    tpl : undefined,

    /**
     * Template engine
     * Built-in options: Underscore, Handlebars
     * todo: global tplEngine setting
     */
    tplEngine : 'Underscore',

    /**
     * True to compile template when idle to speed up app initialization
     */
    tplCompileDeferred : false,

    /**
     * Template data object
     */
    data : undefined,

    /**
     * Plain html to be used instead of template
     */
    html : undefined,

    /**
     * DOM node to apply html to
     */
    applyTo : undefined,

    /**
     * reference to element placed in DOM
     */
    el : undefined,

    /**
     * Template element for use with rapid removal and add. It gets cloned to this.el
     */
    $el : undefined,

    /**
     * Element ID and Page ID all in one
     */
    id : undefined,

    /**
     * True to automatically paint the component
     */
    autoShow : false,

    /**
     * Nested views
     */
    items : [],

    /**
     * Short name for the view. Not used in configuration. Similar to xtype but doesn't need to be registered
     */
    module : undefined,

    /**
     * HTML element making this view/container
     */
    tag : 'div',

    /**
     * CSS classes to add
     */
    cls : undefined,

    /**
     * Flag that tells if view was already painted
     */
    $painted : false,

    /**
     * Initialize tpl and/or html
     */
    init : function () {
        var me = this;

        me.id = me.id || _.uniqueId('view_');

        F.Registry.add(me);

        if (F.isString(me.tpl)) {
            me.initTpl();
        } else if (F.isString(me.html)) {
            me.setHtml();
        }
    },

    /**
     * Initialize and compile template
     */
    initTpl : function () {
        var me = this,
            engine = 'Fly.tpl.' + me.tplEngine;

        // save the original string
        me.$tpl = me.tpl;

        // compile the template
        me.tpl = Fly.init(engine, {
            compileDeferred : true,
            autoRender      : true,
            tpl             : me.tpl,
            data            : me.data,
            listeners       : {
                render : {
                    fn    : me.onTplRender,
                    scope : me
                }
            }
        });
    },

    /**
     * Update template with object data
     * @param data
     */
    setData : function (data) {
        var me = this;

        if (data) {
            me.data = data;
        }

        if (me.tpl) {
            me.tpl.setData(data, true);
        }

        me.reset();

        if (me.autoShow === true || me.el) {
            me.paint();
        }

        me.trigger('update', me, me.data, me.tpl);
    },

    /**
     * Apply html from rendered template
     * @param {Fly.tpl.Abstract} tpl Template instance
     * @param {String} html HTML received from the template
     */
    onTplRender : function (tpl, html) {
        var me = this,
            x,
            y;

        if (me.el) {
            y = pageYOffset;
            x = pageXOffset;
            me.el.html(html);
            // todo: investigate if this is even necessary
            return window.scrollTo(x, y || 1);
        }

        me.setHtml(html);

        me.trigger('update', me, me.data, me.tpl);
    },

    /**
     * Set html content
     * @param html
     */
    setHtml : function (html) {
        var me = this,
            content = html || me.html,
            el = me.$el,
            id = me.id || _.uniqueId('view_'),
            tag = me.tag;

        if (!content && !me.items.length) {
            return false;
        }

        if (!el) {
            me.$el = el = $(document.createElement(tag)).attr('id', id);
            me.addCls(me.cls, me.$el);
            me.setDefferredRelays();
        }

        el.html(content);

        if (me.autoShow === true || me.$painted) {
            // helps with performance on consecutive paints
            Fly.thread(function () { me.paint(); });
        }

        return me;
    },

    addCls : function (cls, el) {
        var me = this;

        cls = cls || me.cls;
        el = el || me.el;

        el.addClass(cls);
    },

    /**
     * Removes references to element (el and $el)
     * @private
     */
    reset : function () {
        var me = this;

        me.remove();
        delete me.el;
    },

    /**
     * Append the element to DOM
     * @param target
     * @returns {*}
     */
    paint : function (target) {
        var me = this,
            content,
            items = me.items;

        me.$painted = true;

        if (me.el) {
            // already painted
            return me;
        }

        if (!me.$el) {
            content = me.setHtml();
            if (!content && !items.length) {
                // no content and no items. Probably waiting for template to render
                return me;
            }
        }

        target = target || me.applyTo || F.body;

        me.trigger('beforepainted', me, me.$el, me.html);

        me.el = me.$el.clone(true);

        // add nested children
        me.add(me.$items || items);

        me.el.appendTo(target);
        me.trigger('painted', me, me.$el, me.html);

        return me;
    },

    setDefferredRelays: function () {
        var me = this,
            deferred = me.deferredEventRelays;

        $.each(deferred, function (index, event) {
            me.relay(event);
        });
    },

    /**
     * Start the destroy sequence. Removes element from DOM and clears events
     */
    destroy : function () {
        var me = this;

        // remove listeners
        me.off();

        me.$painted = false;

        // remove dom
        me.reset();

        delete me.$el;
    },

    /**
     * Hide the View
     */
    hide : function () {
        this.el.hide();
    },

    /**
     * Remove the element from DOM. The element is still cached for fast re-introduction
     * @returns {*}
     */
    remove : function () {
        var me = this;

        if (me.el) {
            me.el.remove();
        }
        delete me.el;

        F.Registry.remove(me);

        return me;
    },

    /**
     * Show after hidden or add after remove
     * @returns {*}
     */
    show : function () {
        var me = this;

        if (me.el) {
            me.el.show();
            return me;
        }

        return me.paint();
    },

    /**
     * Show at position x,y
     * @returns {*}
     */
    showAt : function () {
        var me = this,
            args = arguments,
            xy = ($.isNumeric(args[0]) && $.isNumeric(args[1])) ? args : me.xy;

        if (!me.el) {
            me.paint();
            me.once('painted', function () {
                me.doShowAt(xy[0], xy[1]);
            });
        } else {
            me.doShowAt(xy[0], xy[1]);
        }

        return me;
    },

    /**
     * Sets CSS for showing at specific XY position
     * @private
     * @param x
     * @param y
     */
    doShowAt : function (x, y) {
        this.el.css({
            top      : y + 'px',
            left     : x + 'px',
            position : 'absolute'
        });
    },

    /**
     * Add a child view
     * @returns {*}
     */
    add : function () {
        var me = this,
            args = arraySlice.call(arguments),
            len,
            item;

        if ($.isNumeric(args[0])) {
            args.splice(0, 1);
        }

        len = args.length;

        // if each argument is an item
        if (len > 1) {
            $.each(args, $.proxy(me.add, me));
            return me;
        }

        // if the first argument is array of items
        if ($.isArray(args[0])) {
            $.each(args[0], $.proxy(me.add, me));
            return me;
        }

        item = args[0];

        if (!item) {
            return false;
        }

        if (!F.instanceOf(item, Fly.view.View)) {
            if (!item.module) {
                item.module = 'View';
            }
            if (item.module) {
                item = Fly.init(item.module, item);
            } else {
                return Fly.error('Item not recognized', item, me);
            }

        }
        item.paint(me.el);
    },

    /**
     * Get element object
     * @returns {Element} jQuery element
     */
    getEl: function () {
        return this.el;
    }
});