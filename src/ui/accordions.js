define( function() {
    // Init function that enables the DOM event handlers
    function init() {
        document.body.onclick = function( e ) {
            var target = e.target
            if ( !!~target.className.indexOf( 'title' ) ) {
                var nel = target.nextElementSibling,
                    content = document.getElementsByClassName( 'content' )
                ;[].forEach.call( content, function( el ) {
                    if ( el !== nel ) {
                        el.hidden = true
                    }
                } )
                nel.hidden = !nel.hidden
            }
        }
    }

    return {
        init: init
    }
} )

