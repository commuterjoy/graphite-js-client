
// http://requirejs.org/docs/node.html#nodeModules
if (typeof define !== 'function') {
        var define = require('amdefine')(module);
}

define(function (require, exports, module) {

    var Client = function() {

        var host = 'http://graphite.guprod.gnl/render'
          , self = this;
        
        this.params = { 
              from: '-1hours',
              format: 'jsonp',
              jsonp: 'd'
          };

       this.targets = [];
      
       this.paramsToQueryString = function(){
            return  Object.keys(this.params).map(function(key){
                return key + '=' + self.params[key]
            }).join('&')
       }  

       this.targetsToQueryString = function(){
            return this.targets.map(function(target){
                return 'target=' + encodeURIComponent(target)
            }).join('&')
       }

       this.toUrl = function(){
            return host + '?' + this.targetsToQueryString() + '&' + this.paramsToQueryString() 
       }

    }
    
    exports.client = Client; 

});
