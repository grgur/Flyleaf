/**
 * Manages timers. Timers can fire in batches of N calls per batch. Once a batch is executed, a new timer is created.
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
    /**
     * Number of calls in a single batch
     */
    batch   : 350,

    /**
     * Currently running timer
     * @private
     */
    timerID : 0,

    /**
     * Queue of method calls
     * @private
     */
    queue  : [],

    /**
     * Current timer callback
     * @private
     */
    runner : undefined,

    /**
     * Cache the runner
     */
    init : function () {
        var me = this;
        me.runner = $.proxy(me.runNext, me);
    },

    /**
     * Add a function to the queue. Optionally, execute the timer process immediately.
     * @param {Function}fn Function to execute in timer
     * @param {Boolean} autoStart Start the queue if true
     */
    add   : function (fn, autoStart) {
        this.queue.push(fn);
        if (autoStart) {
            this.start();
        }
    },

    /**
     * Start the queue
     */
    start : function () {
        var me = this;
        if (me.timerID) {
            return;
        }

        me.trigger('start', me);

        me.timerID = setTimeout(me.runner, 0);
    },

    /**
     * Stop execution
     */
    stop  : function () {
        var me = this;
        clearTimeout(me.timerID);
        me.timerID = 0;
        me.trigger('stop', me);
    },

    /**
     * Run the next batch
     */
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