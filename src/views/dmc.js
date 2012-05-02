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
            var container = By.id( 'container' )

            // To empty it out, recursively remove its children
            while ( container.firstChild ) {
                container.removeChild( container.firstChild )
            }

            // Don't forget to show the loading bar back
            By.id( 'loading-dmcs' ).hidden = false

            // Check for disabled class


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

    // Return the necessary functions
    return {
        render: render,
        addPagination: addPagination,
        enablePagination: enablePagination
    }
} )

