
Graphite has a nice simple JSON API, which means we can shift rendering from boring JPGs to exicting JavaScript visualisations. 

# Quickstart

```
npm install
./test.sh
open example.html
```

# Usage

This is written as an AMD module, so you can include it in an HTML page like so,

```
curl(['lib/graphite.js'])
    .then(function(graphite) {
        var g = new graphite.client();
    })
```

Create a simple graph URL with two targets,

```
var g = new graphite.client()
g.targets.push('bar.sum', 'foo.sum');
g.toUrl() // http://graphite.guprod.gnl/render?target=bar.sum&target=foo.sum&from=-1hours
```

... you could put the output of the _toURL()_ function in to the src of an &lt;img&gt; tag for example.

Or we could ask for a JSON object from the last 24 hours,

```
var g = new graphite.client({ format: 'json', 'from': '-24hours' })
g.targets.push('bar.sum', 'foo.sum');
g.toUrl() // http://graphite.guprod.gnl/render?target=bar.sum&target=foo.sum&from=-24hours&format=json&jsonp=?
```

Create a graph with [functions](http://graphite.readthedocs.org/en/latest/functions.html) around the series data,

```
var g = new graphite.client()
g.targets.push(
    new graphite.target('graphite.GU-PROD-Frontend')
      .exclude('__SummaryInfo__')
      .averageSeries()
      .alias('200s')
      .toQueryString()
    )
g.toUrl() // 'http://graphite.guprod.gnl/render?target=alias(averageSeries(exclude(graphite.GU-PROD-Frontend,"__SummaryInfo__")),"foo")&from=-1hours')
```

