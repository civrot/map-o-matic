var width  = 1000,
height = 800;
var svg = d3.select("#map").append("svg")
.attr("width", width)
.attr("height", height );

var projection = d3.geo.albersUsa().scale(1100);
var states = svg.append('g')
.attr('id', 'states');
//states.attr("transform", "scale(1, 1)");

d3.json('/js/json/us-states.json', function(collection) {
  states.selectAll('path')
  .data(collection.features)
  .enter().append('path')
  .attr('d', d3.geo.path().projection(projection))
  .attr('id', function(d){return d.properties.name.replace(/\s+/g, '')})
  .attr('fill', '#ddd')
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
});

ws = new WebSocket("ws://localhost:8181");

ws.onmessage = function(evt) {
  data = JSON.parse(evt.data);
  doStuff(data);
};
