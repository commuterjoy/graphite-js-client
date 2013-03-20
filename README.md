[Graphite](http://graphite.wikidot.com/) has a nice simple JSON API, which means we can shift rendering from boring JPGs to exicting JavaScript visualisations. 

# Quickstart

```
npm install
./test.sh
open example.html
```

## Usage

This is written as an AMD module, so you can include it in an HTML page like so,

```
curl(['lib/graphite.js'])
    .then(function(graphite) {
        var g = new graphite.client();
    })
```

### Basics

Create a simple graph URL with two targets,

```
var g = new graphite.client()
g.targets.push('bar.sum', 'foo.sum');
g.toUrl() // http://graphite.guprod.gnl/render?target=bar.sum&target=foo.sum&from=-1hours
```

... you could put the output of the _toURL()_ function in to the src of an &lt;img&gt; tag for example.

### JSON

Or we could ask for a JSON object from the last 24 hours,

```
var g = new graphite.client({ format: 'json', 'from': '-24hours' })
g.targets.push('bar.sum', 'foo.sum');
g.toUrl() // http://graphite.guprod.gnl/render?target=bar.sum&target=foo.sum&from=-24hours&format=json&jsonp=?
```

### Functions

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
g.toUrl() // ...alias(averageSeries(exclude(graphite.GU-PROD-Frontend,"__SummaryInfo__")),"foo")
```

The order of the functions that are chained is important. The first, after _target(n)_, will form the innermost function around the target, the second the function around that, and so on, until the last function, which will wrap the whole chain.

So, 

```
g.targets.push(
    new graphite.target('abc')
      .foo()  <---- the first function
      .bar("123")
    )
```

Results in,

```
bar(foo(abc),"123")  <---- foo() forms the innermost function, around the target 'abc'
```


