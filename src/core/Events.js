/**
 * @mixin
 *
 * todo: create a mixin injector
 */

var domEvents = [
        'tap', 'tapstart', 'tapend', 'singletap', 'doubletap', 'taphold', 'swipe', 'swipeup', 'swipedown', 'swipeleft',
        'swiperight', 'swipeend', 'scrollstart', 'scrollend', 'orientationchange', 'dblclick', 'click', 'mousemove',
        'mouseout', 'mousein', 'mouseover'
    ],
    Events = Backbone.Events;

Fly.def('Fly.Events', {
    deferredEventRelays : [],

    off : Events.off,

    trigger : Events.trigger,

    init: function () {
        if (!this.relays) {
            this.relays = [];
        }
    },

    on : function (eventName, callback, scope) {
        this.relay(eventName);
        Events.on.apply(this, arguments);
    },

    once : function (eventName, callback, scope) {
        this.relay(eventName);
        Events.once.apply(this, arguments);
    },


    relay : function (eventName) {
        var me = this,
            el = me.el || me.$el,
            isDomEvent = $.inArray(eventName, domEvents) > -1,
            domReady = isDomEvent && el,
            domButNoEl = isDomEvent && !el,
            relayed = domReady ? $.inArray(eventName, me.relays) > -1 : false;

        if (domButNoEl) {
            me.deferredEventRelays.push(eventName);
            return -1;
        }

        if (relayed || !domReady) {
            return false;
        }

        el.on(eventName, function (event) {
            me.trigger(eventName, me, event, this);
        });
        me.relays.push(eventName);

        return true;
    }
});