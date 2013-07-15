/**
 * Instance of {@link Fly.TimerManager} that manipulates with pseudo-threads
 * Batch expensive calls to run one after another and consequently improve browser responsiveness
 * by not locking the main thread for too long
 *
 */
Fly.ThreadManager = Fly.init('TimerManager');


/**
 * Shorthand for Fly.ThreadManager.add with automatic run action
 * @param fn
 */
Fly.thread = function (fn) {
    Fly.ThreadManager.add(fn, 1);
}