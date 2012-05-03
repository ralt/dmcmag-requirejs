define( function() {
    // Init function that enables the DOM event handler
    function init() {
        document.body.addEventListener( 'click', function( e ) {
            var target = e.target;
            if ( target.className === 'close' ) {
                e.preventDefault();
                e.stopPropagation();
                target.parentNode.parentNode.removeChild( target.parentNode );
            }
        }, false );
    }

    return {
        init: init
    };
} );

