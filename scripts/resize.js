

define ([], function () {

    // The resizing function uses an off screen text area, the parent
    // parameter is the element to install this cloned text area.
    // The 'resize' function is called when the text area needs to be
    // resized.
    return function (textarea, parent, resize) {
        
        // Create a copy of the textarea offscreen
        var clone = textarea.clone ().css ({
            position: 'absolute',
            left: -5000
        });
        
        // Attach the clone to the parent element
        clone.appendTo (parent);
        
        // If no resize function is provided use a default
        if (!resize) {
            resize = function (textarea, height) {
                textarea.height(height);
            };            
        }
        
        // Calculate the height missing from scrollTop
        // This is also the extra height required to avoid 'jumping' as the
        // cursor moves to the next line before the new height is set.

        // If the height is not auto then the row setting size calculation may
        // be totally wrong.
        clone.height ('auto');
        clone.attr ('rows', 1);
        var colHeight = clone.height();
        
        var calculateHeight = function () {
            // Random large number to ensure we are scrolled to the bottom of the clone
            clone.scrollTop (textarea.height() + 10000);
            // Need to add the colHeight twice to take account of extra space and
            // the height missing from the scrollTop value.
            return (colHeight * 2) + clone.scrollTop();
        }

        // Perform an initial size calculation
        var old = calculateHeight();

        // Copy text to the clone. Calculate the height and resize the visible text area
        var sizeUpdate = function () {
            clone.val (textarea.val ());
            var latest = calculateHeight();
            // Lets try and avoid extra work by only calling resize when the size has actually changed.
            if (latest != old) {
                old = latest;
                resize (textarea, latest);
            }
        };
        
        // Attach to events
        textarea.bind ('keyup', sizeUpdate);
        textarea.bind ('keydown', sizeUpdate);
        textarea.bind ('change', sizeUpdate);
        
        // Return the initial size of the textarea needed to show all the text
        return old;
    }; 
});
