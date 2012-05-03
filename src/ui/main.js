define( [ 'ui/accordions', 'ui/close' ], function( accordions, close ) {
    // Function initializing the UI components
    function init() {
        accordions.init()
        close.init();
    }

    // Return the functions
    return {
        init: init
    }
} )

