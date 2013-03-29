
var assert = require("assert")
  , should = require("should")
  , amdefine = require("amdefine")
  , graphite = require('../lib/graphite.js');

describe('graphite.client', function(){
   
    it('should be defined', function(){
        (new graphite.client()).should.be.ok
    })
    
    it('should be able to push multiple graphite targets', function(){
        var g = new graphite.client()
        g.targets.push('bar.sum', 'foo-å-sum');
        g.targets.should.have.length(2);
        g.toUrl().should.be.equal('http://graphite.example.com/render?target=bar.sum&target=foo-%C3%A5-sum&from=-1hours&format=json&jsonp=?')
    })
    
    it('should be able to specify the output format', function() {
        var g = new graphite.client({ format: 'png' })
        g.targets.push('foo');
        g.toUrl().should.be.equal('http://graphite.example.com/render?target=foo&from=-1hours&format=png')
    })
    
    it('should be able to specify the time series duration', function() {
        var g = new graphite.client({ from: '-4hours', until: '-2hours', format: 'jpg' })
        g.targets.push('foo');
        g.toUrl().should.be.equal('http://graphite.example.com/render?target=foo&from=-4hours&format=jpg&until=-2hours')
    })
    
    it('should be able to specify the graphite host', function() {
        var g = new graphite.client({ host: 'http://graphite.foo/render' })
        g.targets.push('foo');
        g.toUrl().should.be.equal('http://graphite.foo/render?target=foo&from=-1hours&format=json&jsonp=?')
    })

})

describe('graphite.target', function() {
    
    it('should be defined', function(){
        (new graphite.target(1)).should.be.ok
    })
    
    it('should serialise a function applied to a graphite target', function() {
        var t = new graphite.target('graphite.GU-PROD-Frontend')
                     .timeShift('7d')
        t.toQueryString().should.be.equal('timeShift(graphite.GU-PROD-Frontend,"7d")')
    });

    it('should serialise multiple functions applied to a graphite target', function() {
        var t = new graphite.target('graphite.GU-PROD-Frontend')
                     .exclude('__SummaryInfo__')
                     .averageSeries()
                     .alias('foo')
        t.toQueryString().should.be.equal('alias(averageSeries(exclude(graphite.GU-PROD-Frontend,"__SummaryInfo__")),"foo")')
    })   

    it('should serialise functions with multiple arguments applied to a graphite target', function() {
        var t = new graphite.target('graphite.GU-PROD-Frontend')
                     .hitcount('foo', 'bar','car','la')
        t.toQueryString().should.be.equal('hitcount(graphite.GU-PROD-Frontend,"foo","bar","car","la")')
    })
    
    it('throw error when the target is not given a name', function() {
        (function(){ new graphite.target() }).should.throw(/No target specified/);
    })

})
