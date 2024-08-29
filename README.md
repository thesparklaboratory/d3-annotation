# @sparklaboratory/d3-annotation

This is a forked version from [susielu](https://github.com/susielu/d3-annotation) upgraded to work on latest D3 and all dependencies upgraded.

Existing documentation: [http://d3-annotation.susielu.com](http://d3-annotation.susielu.com), new documentation coming in the future.

## Setup 
### Include the file directly

You must include the [d3 library](http://d3js.org/) before including the annotation file. Then you can add the compiled js file to your website

- [Unminified](https://github.com/thesparklaboratory/d3-annotation/blob/master/dist/d3-annotation.js)
- [Minified](https://github.com/thesparklaboratory/d3-annotation/blob/master/dist/d3-annotation.min.js)

### Using CDN

You can add the latest version of [@sparklaboratory/d3=svg-annotation hosted on jsdelivr](https://cdn.jsdelivr.net/npm/@sparklaboratory/d3-svg-annotation) or [@sparklaboratory/d3-svg-annotation hosted on unpkg](https://unpkg.com/@sparklaboratory/d3-svg-annotation).

### Using NPM

You can add d3-annotation as a node module by running

```bash
npm i @sparklaboratory/d3-svg-annotation
```

```bash
yarn add @sparklaboratory/d3-svg-annotation
```

## Prior art

- [Susie Lu d3-svg-annotation](https://github.com/susielu/d3-annotation) Original library

- [Andrew Mollica](https://bl.ocks.org/armollica/67f3cf7bf08a02d95d48dc9f0c91f26c), [d3-ring-note](https://github.com/armollica/d3-ring-note) D3 plugin for placing circle and text annotation, and [HTML Annotation](http://bl.ocks.org/armollica/78894d0b3cbd46d8d8d19d135c6ca34d)

- [Scatterplot with d3-annotate](https://bl.ocks.org/cmpolis/f9805a98b8a455aaccb56e5ee59964f8), by Chris Polis, example using [d3-annotate](https://github.com/cmpolis/d3-annotate)

- [Rickshaw](http://code.shutterstock.com/rickshaw/) has an annotation tool

- [Benn Stancil](https://modeanalytics.com/benn/reports/21ebfb6b6138) has an annotation example for a line chart

- [Adam Pearce](http://blockbuilder.org/1wheel/68073eeba4d19c454a8c25fcd6e9e68a) has arc-arrows and [swoopy drag](http://1wheel.github.io/swoopy-drag/)

- [Micah Stubbs](http://bl.ocks.org/micahstubbs/fa129089b7989975e96b166077f74de4#annotations.json) has a nice VR chart based on swoopy drag 

- [Scott Logic](http://blog.scottlogic.com/2014/08/26/two-line-components-for-d3-charts.html) evokes “line annotation” in a graph (different concept).

- [Seven Features You’ll Want In Your Next Charting Tool](http://vis4.net/blog/posts/seven-features-youll-wantin-your-next-charting-tool/) shows how the NYT does annotations

- [John Burn-Murdoch](https://bl.ocks.org/johnburnmurdoch/bcdb4e85c7523a2b0e64961f0d227154) example with adding/removing and repositioning annotations
