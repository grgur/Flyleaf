/**
 * Set up the application
 */
Fly.App.setup({
    name   : 'Contacts',
    launch : function () {
        Fly.init('Toolbar').show();
        Fly.init('List').show();
    }
});

/**
 * Main controller
 * Responsible for switching views and populating the form with values
 */
Fly.def('Contacts.controller.Main', {
    extend : 'Fly.Controller',

    editingModel: null,

    control : {
        '$View[html=Back]' : {
            tap : 'showList'
        },
        '.list'            : {
            tap : {
                fn : _.bind(console.log, console, 'DOM event Tap')
            }
        },
        '$ContactEdit'     : {
            swiperight : 'showList',
            dblclick   : 'showList'
        },

        '$List' : {
            itemtap : 'showForm'
        },

        '$View[itemId=newContact]' : {
            tap : 'addContact'
        },

        'form input' : {
            blur : 'updateContact'
        }
    },

    /**
     * Show Form
     * @param {Backbone.Model} model Backbone model (data record)
     */
    showForm : function (model) {
        var l = Fly.Registry.first('List'),
            input,
            f;

        this.editingModel = model;

        l && l.hide();

        f = Fly.init('ContactEdit').show();

        window.scrollTo(0, 1);

        input = f.el.find('input');
        input.attr('disabled', true);
        setTimeout($.proxy(this.loadForm, this, model, input), 350);
    },

    /**
     * Populate form with data from the model
     * @param {Backbone.Model} model Model associated to the clicked contact (list item)
     * @param {$} input jQuery array of input fields
     */
    loadForm : function (model, input) {
        var form = Fly.Registry.first('ContactEdit').getEl();

        input.attr('disabled', false);
        form.find('input').val(null);
        $.each(model.attributes, function (attr, value) {
            form.find('input[name="' + attr + '"]').val(value);
        });

    },

    /**
     * Show the contact list
     */
    showList : function () {
        var l = Fly.Registry.first('List'),
            f = Fly.Registry.first('ContactEdit');

        f && f.destroy();

        if (!l) {
            return;
        }

        l.el.addClass('animated');
        l.show();
    },

    /**
     * Add new contact
     */
    addContact : function () {
        var list = Fly.Registry.first('List'),
            collection = list.data.add({firstName : "Who's this guy?"}),
            model = collection.models.slice(-1)[0];

        // immediately edit the new entry
        this.showForm(model);
    },

    updateContact : function (ev) {
        var model = this.editingModel,
            el = ev.target,
            value = el.value,
            field = el.name;

        model.set(field, value);
    }
});

/**
 * Contact list view
 */
Fly.def('Contacts.view.List', {
    extend    : 'Fly.view.List',
    tplEngine : 'Handlebars',

    cls : 'list fadeInRight',

    itemTpl : '{{firstName}} {{lastName}}',
    data    : [
        {
            firstName : 'John',
            lastName  : 'Smith',
            email     : 'john.smith@example.com',
            cell      : '(123) 456-7890',
            dob       : '2013-07-24'
        },
        {
            firstName : 'Matthew',
            lastName  : 'Welsh',
            email     : 'matt.welsh@example.com',
            cell      : '(321) 654-0987'
        },
        {
            firstName : 'Anthony',
            lastName  : 'Andrews',
            email     : 'aa@example.com',
            dob       : '1979-01-22'
        }
    ]
});

/**
 * Contact form view
 */
Fly.def('Contacts.view.ContactEdit', {
    extend : 'Fly.view.View',

    cls : 'animated fadeInRight',

    tag : 'form',

    html : [
        '<fieldset style="margin-top: 50px;">',
        '<div><label>First name</label><input type="text" name="firstName" required /></div>',
        '<div><label>Last name</label><input type="text" name="lastName" required /></div>',
        '<div><label>E-mail</label><input type="email" name="email" value="some@email.com" /></div>',
        '<div><label>Cell</label><input type="tel"  name="cell" placeholder="(555) 555-5555" pattern="^\(?\d{3}\)?[-\s]\d{3}[-\s]\d{4}.*?$" /></div>',
        '<div><label>DOB</label><input type="date" name="dob" min="1910-08-14" max="2013-11-14" placeholder="1982-06-15"/></div>',
        '</fieldset>'
    ].join('')
});

/**
 * Top toolbar
 */
Fly.def('Contacts.view.Toolbar', {
    extend : 'Fly.view.View',
    cls    : 'panel toolbar',
    items  : [
        {
            html : 'Back',
            cls  : 'button',

            /**
             * You can assign listeners with listeners config option as well
             */
            //            listeners : {
            //                tap : {
            //                    fn : showList
            //                }
            //            }
        },
        {
            html   : 'New',
            cls    : 'button last',
            itemId : 'newContact'
        }
    ]
});