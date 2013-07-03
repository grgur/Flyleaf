/**
 * Manages timers
 * @type {{timerID: number, timers: Array, add: Function, start: Function, stop: Function}}
 *
 * @event start
 * Fires when execution is started
 *
 * @event stop
 * Fires when execution is forcefully stopped
 *
 * @event finish
 * Fires when the queue gets empty
 */

Fly.def('Fly.TimerManager', {
    batch   : 350,
    timerID : 0,
    queue  : [],

    runner : undefined,

    init : function () {
        var me = this;
        me.runner = $.proxy(me.runNext, me);
    },

    add   : function (fn, autoStart) {
        this.queue.push(fn);
        if (autoStart) {
            this.start();
        }
    },
    start : function () {
        var me = this;
        if (me.timerID) {
            return;
        }

        me.trigger('start', me);

        me.timerID = setTimeout(me.runner, 0);
    },
    stop  : function () {
        var me = this;
        clearTimeout(me.timerID);
        me.timerID = 0;
        me.trigger('stop', me);
    },

    runNext : function () {
        var me = this,
            timers = me.queue,
            batch,
            i;

        if (timers.length > 0) {
            batch = timers.splice(0, me.batch);
            for (i = 0; i < batch.length; i += 1) {
                batch[i]();
            }
            me.timerID = setTimeout(me.runner, 0);
        } else {
            me.timerID = 0;
            me.trigger('finish', me);
        }
    }
});