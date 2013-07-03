$.extend(Fly, {

    logLevel : ['error', 'warn', 'log'],

    errorFn : console ? $.proxy(console.error, console) : F.emptyFn,
    warnFn  : console ? $.proxy(console.warn, console) : F.emptyFn,
    logFn   : console ? $.proxy(console.log, console) : F.emptyFn,

    throwOnError : true,

    error : function (msg) {
        var a;

        if (F.throwOnError) {
            throw new Error(msg);
        }

        if ($.inArray('error', F.logLevel) > -1) {
            a = arraySlice.call(arguments);
            return F.errorFn.apply(this, a);
        }
    },

    warn : function () {
        if ($.inArray('warn', F.logLevel) > -1) {
            return F.warnFn.apply(this, arguments);
        }
    },

    log : function () {
        if ($.inArray('log', F.logLevel) > -1) {
            return F.logFn.apply(this, arguments);
        }
    }

});