
define (['resize'], function (resizeTextArea) {

    var Model = Backbone.Model.extend ({
        // The Entry Model is made up of the text content
        // as well as a created and modified time.
        initialize: function () {
            if (!this.get ('content')) {
                this.set ({'content': ''});
            }
            if (!this.get ('favorite')) {
                this.set ({'favorite': false});
            }
            if (!this.get ('modified')) {
                this.set ({'modified': new Date ()});
            }
            if (!this.get ('created')) {
                this.set ({'created': new Date()});
            }
            _.bindAll (this, 'save');
        },
    });
    
    var ListModel = Backbone.Collection.extend ({
        model: Model,
        
        // Entries are stored in local storage for now.
        localStorage: new Store ("entries"),
        
        // Entries are sorted by the time when they were created.
        comparator: function (entry) {
            return entry.get ('created');
        }
    });
    
    var View = Backbone.View.extend ({
        className: 'entry',


        initialize: function () {
            // Bind the event handlers to this object.
            _.bindAll (this, 'save', 'focus', 'delete', 'favorite',
                             'renderFavorite', 'render');

            this.model.bind ('change:favorite', this.renderFavorite);
        },

        // Controller stuff

        // Save the model on keypress
        // Keyup is used as the text is already available in
        // `val` on keyup.
        events: {
          'keyup textarea': 'save',
          'click .entry-toolbar .delete-icon': 'delete',
          'click .entry-toolbar .favorite-icon': 'favorite'
        },

        save: function () {
            this.model.save ({content: this.$('textarea').val()});
        },
        
        focus: function () {
            this.$('textarea').focus();
        },

        delete: function () {
            this.model.destroy ();
        },

        favorite: function () {
            if (this.model.get ('favorite')) {
                this.model.save ({'favorite': false}); 
            } else {
                this.model.save ({'favorite': true}); 
            }
        },

        // View stuff
        renderFavorite: function () {
            if (this.model.get ('favorite')) {
                this.$('.favorite-icon').addClass ('selected'); 
            } else {
                this.$('.favorite-icon').removeClass ('selected'); 
            }
        },

        render: function () {
            // Fill in the DOM tree for this veiw from a template.
            $(this.el).append (_.template($('#entry-template').html(),
                               this.model.toJSON()));

            // Set the textarea to be resizeable and set the correct
            // height for it.
            var ta = this.$('textarea');
            var initial = resizeTextArea (ta, $(this.el), function (textarea, height) {
                textarea.stop().animate({height:height}, 100);
            });
       
            ta.height (initial);
        }
    });
    
    var ListView = Backbone.View.extend ({
        // Bind the list view to the entries element where it belongs.
        el: $("#entries"),
        
        initialize: function () {
            // Bind the event handlers to this object.
            _.bindAll (this, 'onAdd', 'onRemove', 'onRefresh', 'render');
            
            // Bind events from the collection to the event handlers.
            this.collection.bind ('add',     this.onAdd);
            this.collection.bind ('remove',  this.onRemove);
            this.collection.bind ('refresh', this.onRefresh);
        },

        add: function (entry) {
            // The ID of the view element is the same as the CID for lookup.
            var v = new View ({model: entry, id: entry.cid});

            // Insert the element in to the list and render the view.
            this.el.prepend (v.el);
            v.render ();
            return v;
        },
        
        onAdd: function (entry) {
            var v = this.add (entry);
            // Animate the introduction of the new element.
            $(v.el).hide ();
            $(v.el).slideDown (100, function () {
                v.focus();
            });
        },

        onRemove: function (entry) {
            // Lookup the view containing the entry.
            var v = this.$('#' + entry.cid);

            if (v) {
                v.slideUp (100, function () {
                    v.remove ();
                });
            }
        },
        
        onRefresh: function () {
            // Clear the existing views
            this.el.empty ();
            // For each model render and add the view
            this.collection.each (_.bind (function (entry) {
                this.add (entry);
            }, this));
        },

        render: function () {
            this.onRefresh ();
        }
    });
    
    return {
        Model: Model,
        ListModel: ListModel,
        View: View,
        ListView: ListView
    };
});
