var version = '<%= pkg.version %>.<%= grunt.template.today("yyyymmdd-HHMM") %>',
    libName = global.Flyleaf || 'Fly',
    Fly = {},
    F = Fly, //shorthand
    nsCache = {},
    arraySlice = Array.prototype.slice,
    doc = $(document),
    onTouchEnd,
    isObjectCreate = $.isFunction(Object.create),
    isMobile;

global[libName] = Fly;

$.extend(Fly, {
    /**
     * Global variable (usually equals to window in browsers, but doesn't have to)
     */
    global : global,

    /**
     * Current build version
     */
    version : version,

    /**
     * Flag for a generic click event. You can listen to this event to fight the 300ms delay in mobile browsers
     */
    clickEvent : 'tap',

    /**
     * Cached jQuery document reference
     */
    doc : doc,

    /**
     * Cached document.body jQuery reference
     * To be referenced after document is fully loaded
     */
    body: undefined,

    /**
     * Use this as a generic empty function to avoid expensive function creation where unnecessary
     */
    emptyFn : $.noop,

    /**
     * Test if reference is a string
     * @param reference
     * @returns {boolean}
     */
    isString : function (reference) {
        return $.type(reference) === "string";
    },

    /**
     * Check if reference is an object
     * @param reference
     * @returns {boolean}
     */
    isObject : function (reference) {
        return $.type(reference) === "object";
    },

    /**
     * Check if reference is a function. Uses jQuery method
     */
    isFunction : $.isFunction,

    /**
     * Check if reference is numeric. Uses jQuery method
     */
    isNumeric  : $.isNumeric,

    /**
     * Check if reference is an array. Uses jQuery method
     */
    isArray    : $.isArray,

    /**
     * For each iterator. Uses underscore method as it's often faster than jQuery alternative
     */
    each       : _.each,


    /**
     * Simple prototypeal inheritance.
     * Used when extending consturctors (e.g. Backbone Models or Collections) or when dealing with older browsers
     * @param {Function} extend Constructor
     * @param {Object} config Default configuration to apply to prototype
     * @returns {Function} Newely created constructor
     */
    protoInherit: function (extend, config) {
        var Class = function () {
            extend.apply(this, arguments);
        };

        Class.prototype = extend.prototype;
        $.extend(Class.prototype, config);
        return Class;
    },

    /**
     * Check if object is truly an instance of the class
     * Works with prototypeal or Object.create inheritance
     * @param {Object} instance Instance to check
     * @param {Object/Function} Class Class to test against
     * @returns {Boolean} True if inheritance detected
     */
    instanceOf : function (instance, Class) {
        if (!instance || !Class) {
            return false;
        }

        if (isObjectCreate) {
            return Class.isPrototypeOf(instance);
        }

        return instance instanceof Class;
    },

    /**
     * Helper function that determines if a data set is actually a Backbone Collection or just a plain object
     * @param {Object} data
     * @returns {boolean} True if instance of Backbone.Collection
     */
    isCollection : function (data) {
        return (data instanceof Backbone.Collection) || (data.prototype instanceof Backbone.Collection);
    },

    /**
     * Test if user agent is a mobile browser
     * @returns {Boolean} True if app runs in a mobile browser
     */
    isMobile : function () {
        var ua = navigator && (navigator.userAgent || navigator.vendor)
            || window && window.opera
            || ''; // not in a browser

        if (isMobile === undefined) {
            isMobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
        }

        return isMobile;
    }
});

/**
 * Sets up inheritance method according to the browser support
 * Will use Object.create in ECMAScript 5 browsers or prototypeal inheritance in older (<IE9)
 * @type {*}
 */
Fly.objCreate = isObjectCreate ? Object.create : F.protoInherit;

$(function () {
    // reference document.body
    F.body = $('body');

    // remove address bar on compatible mobile devices
    F.isMobile() && setTimeout(function () {
        if (!pageYOffset) {
            window.scrollTo(0, 1);
        }
    }, 100);

    // Init hammer touch events
    if (Hammer && Hammer.READY === false) {
        Fly.body.hammer();
    }
});