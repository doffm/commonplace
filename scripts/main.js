
require (["entry"], function (Entry) {

    /*
    $(document).ready(function() {
        Commonplace.resizeTextArea ($('.editing').first(), function (textarea, size) {
            textarea.stop().animate({height:size}, 50, 'linear');
        });

        $('.entry p').click(function (event) {
            var e = $(event.target);
            var ta = $('<textarea/>').addClass ('editing').val (e.html());
            e.replaceWith (ta);
        });
    });
    */
    

    
    require.ready (function () {
        // Don't render the toolbar right now. Hard coded in to HTML
        var Toolbar = Backbone.View.extend ({
            el: $("#toolbar"),

            events: {
                "click #new": "newEntry"
            },

            // Create a new commonplace entry
            newEntry: function () {
                this.collection.add (new Entry.Model ());
            }
        });

        var entries = new Entry.ListModel ();
        
        window.commonToolbar = new Toolbar ({collection: entries})
        window.entriesView = new Entry.ListView ({collection: entries});
        entries.fetch ();
    });
});
