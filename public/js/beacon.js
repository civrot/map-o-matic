//Create list for all beacons to be a part of.
var BeaconList = function (expireTime) {
	this.expireTimeInMs = expireTime;
	this.beacons = [];
};

BeaconList.prototype.dataList = function () {
	var myBeaconCoords = [],
		self = this;
	self.beacons.foreach( function (myBeacon, index, array) {
		myBeaconCoords.push(myBeacon.coords)
	});
	return myBeaconCoords;
};

BeaconList.prototype.expireOldBeacons = function () {
	var self = this;
	self.beacons.foreach( function (myBeacon, index, beaconArray) {
		if (((new Date) - this.expire) > this.expireTimeInMs) {
			beaconArray.splice(index--, 1);
			myBeacon.destroy();
		}
	});
};

var ONE_HOUR = 60 * 60 * 1000;
bl = new BeaconList(ONE_HOUR);

var Beacon = function (data) {
	this.address = data.address;
  this.coords = projection(data.coords);
	this.imageUrl = data.imageUrl;
	bl.beacons.push(this);
};

var getCoords = function (address) {
	//Address geo locate
	return projection([x, y]);//projection([this.lat, this.long]);
};

Beacon.prototype.createBlip = function () {
	//Use D3 to create blip on map
	coords = this.coords;

	//Draw ping
	svg.append("circle")
	  .attr("cx", coords[0])
	  .attr("cy", coords[1])
	  .attr("r", 2)
	  .style("fill", "red")
	  .style("opacity", .4)
	  .style("stroke", "red")
	  .style("stroke-opacity", 1)
	  .style("stroke-width", 3)
	  .transition()
	  .duration(750)
	  .attr("r", 42)
	  .style("opacity", 0)
	  .style("stroke-opacity", 0)
		.remove();

	//Flash image of product
	svg.append("div")
		.html("<img src =" + this.imageUrl + "/>")
    .attr("x", coords[0])
    .attr("y", coords[1])
    .style("class", "toolTip")
    .transition()
	  .duration(1750)
	  .style("opacity", 0)
	  .remove();

	//Draw Circle
	svg.append("circle")
		.data(coords)
		.attr("cx", coords[0])
		.attr("cy", coords[1])
		.attr("r", 5)
		.attr("class", "blip")
		.style("fill", '#00ccff')
		.append("div")
		.style("height", "100px")
		.style("width", "100px")
		.style("fill", "red")
		.on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("<img src =" + this.imageUrl + "/>")
                .style("left", (svg.event.pageX) + "px")
                .style("top", (svg.event.pageY - 28) + "px");
            })
		.on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
};

Beacon.prototype.destroy = function () {
	svg.selectAll("circle")
		.data(bl.dataList)
		.exit()
		.remove();
};
