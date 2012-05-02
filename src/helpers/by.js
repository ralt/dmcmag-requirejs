define( function() {
    // Pretty fast - http://jsperf.com/select-vs-natives-vs-jquery
    /*
        By, shortcuts for getting elements.
    */
    var By = { 
        id: function (id) { return document.getElementById(id) }, 
        tag: function (tag, context) { 
            return (context || document).getElementsByTagName(tag)
        }, 
        "class": function (klass, context) {
            return (context || document).getElementsByClassName(klass)
        },
        name: function (name) { return document.getElementsByName(name) }, 
        qsa: function (query, context) { 
            return (context || document).querySelectorAll(query)
        },
        qs: function (query, context) {
            return (context || document).querySelector(query)
        }
    }

    return By
} )

