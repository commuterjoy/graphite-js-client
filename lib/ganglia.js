
// http://requirejs.org/docs/node.html#nodeModules
if (typeof define !== 'function') {
        var define = require('amdefine')(module);
}

define(function (require, exports, module) {

    var Target = function(id) {
      
        this.id = id; 
        this.callChain = []

        this.exclude = function(exclude) { 
            this.callChain.push({ name: 'exclude', args: [exclude] }) // pattern (function, [args])
            return this // chainable
        } 
        
        this.averageSeries = function() {
            this.callChain.push({ name: 'averageSeries', args: [] })
            return this
        } 
        
        this.alias = function(alias) {
            this.callChain.push({ name: 'alias', args: [alias] })
            return this
        } 
        
        this.timeshift = function(t) {
            this.callChain.push({ name: 'timeshift', args: [t] })
            return this
        } 

        this.hitcount = function(intervalString, alignToInterval) {
            this.callChain.push({ name: 'hitcount', args: [intervalString, alignToInterval] })
            return this
        }

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

    var Client = function() {

        var host = 'http://graphite.guprod.gnl/render'
          , self = this;
        
        this.params = { 
              from: '-1hours',
              format: 'json',
              jsonp: '?'
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
    exports.target = Target; 

});
