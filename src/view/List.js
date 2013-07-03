Fly.def('Fly.view.List', {
    extend : 'Fly.view.View',

    tag : 'ul',

    itemTpl : '',

    itemCls : '',

    init : function () {
        var me = this;

        //make sure we use collection
        me.data = me.convertToCollection(me.data);

        me.setCollectionChangeEvent();

        me.formatTpl();

        me.callParent('init', arguments, me);

        me.on('beforepainted', function (me, $el) {
            $el.delegate('li', 'tap', function (event) {
                var el = this,
                    record = me.data.get(el.getAttribute('data-id'));
                me.trigger('itemtap', record, el, me, event);
            });
        });
    },

    formatTpl: function () {
        var me = this;

        me.tpl = [
            '{{#each .}}',
            '<li ',
                me.itemCls ? ' class="' + me.itemCls + '" ' : '',
             'data-id="{{modelId}}">',
                me.itemTpl,
            '</li>',
            '{{/each}}'
        ].join('');
    },

    convertToCollection : function () {
        var me = this,
            data = arguments[0] || me.data;

        // if already a Collection then exit
        if (Fly.isCollection(me.data)) {
            return me.data;
        }

        return new Backbone.Collection(data);
    },

    onCollectionChange : function (event, model, collection) {
        collection = (collection instanceof Backbone.Collection) ? collection : this.data;
        this.tpl.setData(collection, true);
    },

    setCollectionChangeEvent : function () {
        this.data.on('all', this.onCollectionChange, this);
    }


});