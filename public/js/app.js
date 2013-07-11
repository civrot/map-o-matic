var width  = 1800,
height = 1600;
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height );

var projection = d3.geo.albersUsa();
var states = svg.append('g')
.attr('id', 'states');
states.attr("transform", "scale(1, 1)");

d3.json('/js/json/us-states.json', function(collection) {
  states.selectAll('path')
  .data(collection.features)
  .enter().append('path')
  .attr('d', d3.geo.path().projection(projection))
  .attr('id', function(d){return d.properties.name.replace(/\s+/g, '')})
  .attr('fill', 'gray')
  .attr('stroke', 'white')
  .attr('stroke-width', '1')
});

ws = new WebSocket("ws://localhost:8080");

ws.onmessage = function(evt) {
  doStuff(evt);
};

