define( [ 'models/dmc', 'views/dmc' ], function( dmcModel, dmcView ) {
    // Initialize the controller
    function init() {
        // Load the DMCs from page 1
        load( 1 )

        // And load the pagination
        enablePagination()
    }

    // Load the DMCs
    function load( page ) {
        // Load the first 20 DMCs
        dmcModel.getAll( page, function( dmcs ) {
            // For each of them, get their title/body
            dmcs.forEach( getOne )
        })
    }

    // Function called by the foreach
    function getOne( dmc ) {
        // Call the model
        dmcModel.getOne( dmc.nid, dmcView.render )
    }

    // Function to enable the pagination
    function enablePagination() {
        /**
         * Load every page and find out the number of items
         * Add the number to the pagination till the number of DMCs
         * is below 20 (which means it's the last page).
         */

        // Set an incremental variable
        var i = 2

        // As long as the next page exists
        ;( function loadNext( pageNumber ) {
            var pageNumber = pageNumber || 1

            dmcModel.getAll( pageNumber, function( dmcs ) {

                // First, load the result to the pagination
                dmcView.addPagination( pageNumber )

                // Now that we've got all the DMCs, check if it needs
                // to loop again
                if ( dmcs.length === 20 ) {
                    loadNext( i++ )
                }

                // Otherwise, add the event handler
                else {
                    dmcView.enablePagination( load )
                }
            } )
        } () )
    }

    return {
        init: init
    }
} )

