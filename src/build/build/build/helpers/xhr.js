define([],function(){Object.merge=function(){return[].reduce.call(arguments,function(a,b){return Object.keys(b).forEach(function(c){a[c]=b[c]}),a},{})};var a=function(){var a={number:!0,string:!0,"boolean":!0},b=function(b){return typeof b in a?encodeURIComponent(b.toString()):""},c=function(a,c){return a=b(a),c.map(function(b){return d(a,b,!0)})},d=function(a,c,d){return d||(a=b(a)),a+"="+b(c)};return function(a){return Object.keys(a).map(function(b){var e=a[b];return Array.isArray(e)?c(b,e):d(b,e)}).join("&")}}(),b=function(b){b=Object.merge({method:"GET",headers:{},complete:function(){}},b),b.headers=Object.merge({"Content-Type":"application/x-www-form-urlencoded"},b.headers),typeof b.data=="object"&&!b.data.charAt&&(b.data=a(b.data));var c=new XMLHttpRequest;return c.open(b.method,b.url),c.addEventListener("readystatechange",function(){c.readyState===4&&b.complete.call(b.thisArg,c.responseText,c)}),Object.keys(b.headers).forEach(function(a){c.setRequestHeader(a,b.headers[a])}),c.send(b.data),c};return b})