
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
        g.toUrl().should.be.equal('http://graphite.guprod.gnl/render?target=bar.sum&target=foo-%C3%A5-sum&from=-1hours&format=json&jsonp=?')
    })
    
    it('should push ganglia targets with functions', function() {

        var t = new ganglia.target('ganglia.GU-PROD-Frontend')
                     .exclude('__SummaryInfo__')
                     .averageSeries()
                     .alias('foo')

        t.toQueryString().should.be.equal('alias(averageSeries(exclude(ganglia.GU-PROD-Frontend,"__SummaryInfo__")),"foo")')
        
        var t = new ganglia.target('ganglia.GU-PROD-Frontend')
                     .timeshift('7d')

        t.toQueryString().should.be.equal('timeshift(ganglia.GU-PROD-Frontend,"7d")')

        var t = new ganglia.target('ganglia.GU-PROD-Frontend')
                     .hitcount('foo', 'bar')

        t.toQueryString().should.be.equal('hitcount(ganglia.GU-PROD-Frontend,"foo","bar")')
    })

    it('should be able to specify the output format', function() {
        var g = new ganglia.client({ format: 'png' })
        g.targets.push('foo');
        g.toUrl().should.be.equal('http://graphite.guprod.gnl/render?target=foo&from=-1hours&format=png')
    })
    
    it('should be able to specify the time series duration', function() {
        var g = new ganglia.client({ from: '-4hours', format: 'jpg' })
        g.targets.push('foo');
        g.toUrl().should.be.equal('http://graphite.guprod.gnl/render?target=foo&from=-4hours&format=jpg')
    
    })

})
