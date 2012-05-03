define( [ 'helpers/xhr', 'helpers/by' ], function( xhr, By ) {
    // Variable to hold the template
    var tmpl,
    // Variable to have a backlog of DMCs
        backlog,
    // Variable to hold a callback during multiple functions
        callback

    // Function that will render the DMCs
    function render( dmc ) {
        // If the template is already loaded, display the dmc right away
        if ( tmpl ) {
            displayDmc( dmc )
        }
        // If the backlog isn't empty, it means the template is being loaded
        else if ( backlog ) {
            // So push the DMC in the backlog
            backlog.push( dmc )
        }
        else {
            // The template is not loaded yet. Let's add the DMC to the
            // backlog and launch the request.
            backlog = [ dmc ]

            // Let's load the template
            loadTemplate( function( data ) {
                // Now we've got the template, set the variable
                tmpl = data

                // Then call displayDmc for each dmc stored in the backlog
                // and remove it from the backlog.
                while ( backlog.length ) {
                    displayDmc( backlog.shift() )
                }
            } )
        }
    }

    // Display the DMC
    function displayDmc( dmc ) {
        // Create a DOM element to append the values of the DMC
        var tmp = document.createElement( 'div' )
        tmp.innerHTML = tmpl
        // Fill in the correct values
        tmp.getElementsByClassName( 'title' )[ 0 ].textContent = dmc.title
        tmp.getElementsByClassName( 'content' )[ 0 ].appendChild( dmc.body )

        // Hide the loading img
        var loading_dmcs = By.id( 'loading-dmcs' )
        if ( !loading_dmcs.hidden ) {
            loading_dmcs.hidden = true
        }

        // And append the datas to the body
        By.id( 'container' ).appendChild( tmp )
    }

    // Add the pagination link
    function addPagination( pageNumber ) {
        // Now create DOM elements
        var li = document.createElement( 'li' ),
            a = document.createElement( 'a' ),
            last = By.id( 'last' )

        // Set the correct values
        a.href = '#'
        a.textContent = pageNumber

        // Append the anchor to the li
        li.appendChild( a )

        // If it's the first page, set the number to "disabled"
        if ( pageNumber === 1 ) {
            li.className = 'disabled'
        }

        // And append this to the pagination
        last.parentNode.insertBefore( li, last )
    }

    // Enable the pagination once everything is loaded
    function enablePagination( cb ) {
        // Store the callback in the closure
        callback = cb

        // First, remove the loading icon since it's over
        By.id( 'loading-pagination' ).hidden = true

        // Then, set the event handler
        By.id( 'pagination' ).onclick = paginationHandler
    }

    // Handling pagination event
    function paginationHandler( e ) {
        // If it's a link, let's get working
        if ( e.target.nodeName === 'A' ) {

            // First, prevent it from bubbling and linking
            e.preventDefault()
            e.stopPropagation()

            // Empty out the container, and run the callback
            var pagination = By.id( 'pagination' ),
                first = By.id( 'first'),
                last = By.id( 'last' );

            removeChildren( By.id( 'container' ) );

            // Don't forget to show the loading bar back
            By.id( 'loading-dmcs' ).hidden = false

            // Check for disabled class
            if ( e.target !== first.nextElementSibling ) {
                first.className = '';
            }
            else if ( e.target !== last.previousElementSibling ) {
                last.className = '';
            }

            // Now remove the disabled class from the old number
            [].forEach.call( By.class( 'disabled' ), function( el ) {
                el.className = '';
            } );

            // And set it on the LI element
            e.target.parentNode.className = 'disabled';

            // Now run the callback of the controller stored in the closure
            callback( e.target.textContent )
        }
    }

    // Load the template
    function loadTemplate( callback ) {
        xhr( {
            url: 'src/templates/dmc.html',
            complete: function( data ) {
                callback( data )
            }
        } )
    }

    // Enable the search
    function enableSearch( model, callback ) {
        By.id( 'search' ).onkeypress = function( e ) {
            if ( e.keyCode === 13 ) {
                // If the value is empty, something's wrong so don't do
                // anything
                if ( this.value === '' ) {
                    return;
                }

                // Show the loading dmcs icon
                By.id( 'loading-dmcs' ).hidden = false;

                // Hide the pagination loading link if it's not
                var loading_pagination = By.id( 'loading-pagination' );
                if ( !loading_pagination.hidden ) {
                    loading_pagination.hidden = true;
                }

                // Remove the "reset search" button if it exists
                var reset = By.id( 'reset' );
                if ( reset ) {
                    reset.parentNode.removeChild( reset );
                }

                // Empty out the list of DMCs
                removeChildren( By.id( 'container' ) );

                // Also empty out the pagination
                removeChildren( By.id( 'pagination' ) );

                // And call the callback
                model( this.value, callback );
            }
        }
    }

    // Function to enable the "reset search" button
    function enableResetSearch( callback ) {
        var reset = document.createElement( 'input' ),
            div = document.createElement( 'div' ),
            search = By.id( 'search' );

        div.className = 'input';
        div.appendChild( reset );

        reset.id = 'reset';
        reset.type = 'button';
        reset.value = 'Annuler la recherche';
        reset.onclick = function() {
            // Remove the results list
            removeChildren( By.id( 'container' ) );

            // Remove the button itself
            this.parentNode.removeChild( this );

            // Remove the text from the search field
            this.value = '';

            // Show the loading icon
            By.id( 'loading-dmcs' ).hidden = false;

            // And call the callback (init from the controller)
            callback();
        }

        search.parentNode.insertBefore( div, search.nextElementSibling );
    }

    // Display an error
    function displayError( error ) {
        var el = document.createElement( 'div' ),
            close = document.createElement( 'a' ),
            search = By.id( 'search' );

        // Stop the loading if there is an error
        By.id( 'loading-dmcs' ).hidden = true;

        close.className = 'close';
        close.href = '#';
        close.innerHTML = '&times;';
        el.appendChild( close );

        el.className = 'alert alert-error';
        el.appendChild( document.createTextNode( error ) );

        search.parentNode.insertBefore( el, search );
    }

    // Utility function to remove children
    function removeChildren( el ) {
        while ( el.firstChild ) {
            el.removeChild( el.firstChild );
        }
    }

    // Return the necessary functions
    return {
        render: render,
        addPagination: addPagination,
        enablePagination: enablePagination,
        enableSearch: enableSearch,
        enableResetSearch: enableResetSearch,
        displayError: displayError
    }
} )

