//Create list for all beacons to be a part of.
var BeaconList = function (expireTime) {
	this.expireTimeInMs = expireTime;
	this.beacons = [];
};

//A list of each beacons coordinates which are use to identify each blip
BeaconList.prototype.dataList = function () {
	var myBeaconCoords = [],
		n = 0;
	for(n = 0; n < this.beacons.length; n++) {
		myBeaconCoords.push(this.beacons[n].coords);
	}
	return myBeaconCoords;
};

//Clean out the beacon list of expired beacons
BeaconList.prototype.expireOldBeacons = function () {
	var n = 0, now;
	for( n = this.beacons.length - 1; n < this.beacons.length; n++) {
		now = new Date();
		if ((now - this.beacons[n].expire) > this.expireTimeInMs) {
			this.beacons.splice(n, 1);
			this.beacons[n].destroy();
		}
	}
};

var ONE_HOUR = 0.5 * 60 * 1000;
bl = new BeaconList(ONE_HOUR);

var Beacon = function (data) {
	this.address = data.address;
  this.coords = projection(data.coords);
	this.imageUrl = data.imageUrl;
	this.expire = new Date();
	bl.beacons.push(this);
	//bl.expireOldBeacons();
};

Beacon.prototype.createBlip = function () {
	//Use D3 to create blip on map
	coords = this.coords;
	blipColor = "#00ccff";
	pingColor = "#FF6633"

	//Draw ping
	svg.append("circle")
	  .attr("cx", coords[0])
	  .attr("cy", coords[1])
	  .attr("r", 2)
	  .style("fill", pingColor)
	  .style("opacity", .4)
	  .style("stroke", pingColor)
	  .style("stroke-opacity", 1)
	  .style("stroke-width", 3)
	  .transition()
	  .duration(750)
	  .attr("r", 72)
	  .style("opacity", 0)
	  .style("stroke-opacity", 0)
		.remove();

	//Draw Circle
	svg.append("circle")
		.data(coords)
		.attr("cx", coords[0])
		.attr("cy", coords[1])
		.attr("r", 5)
		.attr("class", "blip")
		.style("fill", blipColor);

	svg.append("svg:image")
    .attr("xlink:href", this.imageUrl)
    .attr("x", coords[0] - 20)
    .attr("y", coords[1])
    .attr("width", "100")
    .attr("height", "100")
    .style("stroke", blipColor)
	  .style("stroke-opacity", 1)
    .style("opacity", .86)
    .transition()
    .duration(450)
    .delay(250)
    .attr("height", "300")
    .attr("width", "300")
    .attr("x", coords[0] - 120)
    .attr("y", coords[1] - 100)
    .style("opacity", 0)
    .remove();

};

// Beacon.prototype.destroy = function () {
// 	blipData = bl.dataList();
// 	var c = svg.selectAll("circle").data(blipData, function(d) { return(d); });
// 	c.exit().remove();
// };
