var domMatch = /^[#\.a-zA-Z]/,
    clsMatch = /^\$/;


Fly.def('Fly.Controller', {

    singleton: true,

    /**
     *
     *
     * .class
     * #id
     * $className as in Fly.ns(__className__)
     * $className[foo=bar]
     *
     *
     *
     * control: {
     *  'something' : {
     *      event: 'fn'
     *  }
     * }
     */
    control: {},

    construct: function () {
//        var me = this;

        if (this !== Fly.Controller) {
            Fly.Registry.addController(this);
        }

//        F.each(me.control, me.assignListener, me);
    }


});
