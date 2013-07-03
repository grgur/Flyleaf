/**
 * Instance of {@link Fly.TimerManager} that manipulates with pseudo-threads
 * @type {*}
 */
Fly.ThreadManager = Fly.init('TimerManager');


/**
 * Shorthand for Fly.ThreadManager.add with automatic run action
 * @param fn
 */
Fly.thread = function (fn) {
    Fly.ThreadManager.add(fn, 1);
}