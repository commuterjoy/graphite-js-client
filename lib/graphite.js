
// http://requirejs.org/docs/node.html#nodeModules
if (typeof define !== 'function') {
        var define = require('amdefine')(module);
}

define(function (require, exports, module) {

    var Target = function(id) {
      
        var self = this;

        this.id = id; 
        this.callChain = [];

        ['exclude', 'averageSeries', 'alias', 'timeshift', 'hitcount'].forEach(function(f) {
            self[f] = function() {
                self.callChain.push({ name: f, args: [].slice.call(arguments) })
                return self;
            }
        })
        
        this.toQueryString = function(n) {
            var n = (isNaN(n)) ? this.callChain.length - 1 : n
            if (n >= 0) {
                return this.callChain[n].name
                        + '(' 
                        + this.toQueryString(n-1) 
                        + this.callChain[n].args.map(function(a){ return ',"' + a +'"' }).join('')
                        + ')'
            }
            return this.id
        }
    }

    var Client = function(opts) {

       var opts = opts || {}
         , host = opts.host || 'http://graphite.guprod.gnl/render'
         , self = this;
       
       this.params = { 
              from: opts.from || '-1hours',
              format: opts.format || 'json',
          };

       if (this.params.format === 'json') {
           this.params.jsonp = '?'
       }

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
    exports.target = Target; 

});
