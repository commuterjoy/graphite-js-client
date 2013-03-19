
var assert = require("assert")
  , should = require("should")
  , amdefine = require("amdefine")
  , ganglia = require('../lib/ganglia.js');

describe('Ganglia client', function(){
   
    it('should be defined', function(){
        (new ganglia.client()).should.be.ok
    })
    
    it('should be able to push multiple ganglia targets', function(){
        var g = new ganglia.client()
        g.targets.push('bar.sum', 'foo-å-sum');
        g.targets.should.have.length(2);
        g.toUrl().should.be.equal('http://graphite.guprod.gnl/render?target=bar.sum&target=foo-%C3%A5-sum&from=-1hours&format=jsonp&jsonp=d')
    })
    
    xit('should push ganglia targets with aliases', function() {}) 
    xit('should be able to specify the output format', function() {})
    xit('should be able to specify the time series duration', function() {})
    xit('should be able to specify the jsonp callback', function() {})

})
