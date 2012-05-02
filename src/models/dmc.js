define( [ 'helpers/xhr' ], function( xhr ) {
    // Get 20 dmc
    function getAll( page, callback ) {
        xhr( {
            url: buildUrl( {
                page: page,
                fields: 'nid',
                parameters: {
                    type: 'fiche_receptif'
                }
            } ),
            complete: function( data ) {
                callback( JSON.parse( data ) )
            }
        } )
    }

    // Get one dmc from its nid
    function getOne( nid, callback ) {
        xhr( {
            url: buildUrl( {
                nid: '/' + nid
            } ),
            complete: function( data ) {
                callback( parse( JSON.parse( data ) ) )
            }
        } )
    }

    // Parse the datas received to send back only title and body
    function parse( data ) {
        var obj = {}
        obj.title = data.title

        // First, clean up the data.body variable to remove <img> tags
        // and avoid loading them.
        data.body = data.body.replace( /<img[^>]+>/g, '' )

        obj.body = (function() {
            // Create a DOM element to parse out the body
            var el = document.createElement( 'div' )

            el.innerHTML = data.body

            // Get only the first paragraph
            el = el.querySelector( '#para_1' )

            // Also, remove the images
            ;[].forEach.call( el.getElementsByTagName( 'img' ), function( e ) {
                e.parentNode.removeChild( e )
            } )

            // And return the element
            return el
        } () )

        return obj
    }

    // Utility function to build the URL
    function buildUrl( params ) {
        // Some variable to reduce number of characters
        var endpoint = 'http://www.dmcmag.com/rest_service/node'

        // Don't fuck up the parameters
        ;[ 'nid', 'page', 'fields', 'parameters' ].forEach( function( par ) {
            if ( params[ par ] === undefined ) {
                params[ par ] = ''
            }
        } )

        // Build the first easy part of the URL
        var url = endpoint +
            params.nid +
            '.json?page=' + params.page +
            '&fields=' + params.fields

        // Build the parameters part
        if ( params.parameters !== '' ) {
            Object.keys( params.parameters ).forEach( function( type ) {
                url += '&parameters[' + type + ']=' + params.parameters[ type ]
            } )
        }

        // And return the built url
        return url
    }

    return {
        getAll: getAll,
        getOne: getOne
    }
} )

