define(["models/dmc","views/dmc"],function(a,b){function c(){d(),f()}function d(){a.getAll(1,function(a){a.forEach(e)})}function e(c){a.getOne(c.nid,b.render)}function f(){}return{init:c}})