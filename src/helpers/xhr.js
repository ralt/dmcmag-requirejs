define( function() {
    // Small utility function for XHR
    Object.merge = function () {
        return [].reduce.call( arguments, function ( ret, merger ) {

            Object.keys( merger ).forEach(function ( key ) {
                ret[ key ] = merger[ key ];
            });

            return ret;
        }, {} );
    };

    // Another utility
    var urlstringify = (function () {
        //simple types, for which toString does the job
        //used in singularStringify
        var simplies = { number : true, string : true, boolean : true };

        var singularStringify = function ( thing ) {
            if ( typeof thing in simplies ) {
                return encodeURIComponent( thing.toString() );
            }
            return '';
        };

        var arrayStringify = function ( key, array ) {
            key = singularStringify( key );

            return array.map(function ( val ) {
                return pair( key, val, true );
            });
        };

        //returns a key=value pair. pass in dontStringifyKey so that, well, the
        // key won't be stringified (used in arrayStringify)
        var pair = function ( key, val, dontStringifyKey ) {
            if ( !dontStringifyKey ) {
                key = singularStringify( key );
            }

            return key + '=' + singularStringify( val );
        };

        return function ( obj ) {

            return Object.keys( obj ).map(function ( key ) {
                var val = obj[ key ];

                if ( Array.isArray(val) ) {
                    return arrayStringify( key, val );
                } else {
                    return pair( key, val );
                }
            }).join( '&' );
        };
    }())

    var xhr = function ( params ) {
        //merge in the defaults
        params = Object.merge({
            method   : 'GET',
            headers  : {},
            complete : function (){}
        }, params );

        params.headers = Object.merge({
            'Content-Type' : 'application/x-www-form-urlencoded'
        }, params.headers );

        //if the data is an object, and not a fakey String object, dress it up
        if ( typeof params.data === 'object' && !params.data.charAt ) {
            params.data = urlstringify( params.data );
        }

        var xhr = new XMLHttpRequest();
        xhr.open( params.method, params.url );

        xhr.addEventListener( 'readystatechange', function () {
            if ( xhr.readyState === 4 ) {
                params.complete.call(
                    params.thisArg, xhr.responseText, xhr
                );
            }
        });

        Object.keys( params.headers ).forEach(function ( header ) {
            xhr.setRequestHeader( header, params.headers[header] );
        });

        xhr.send( params.data );

        return xhr;
    }

    return xhr
} )

