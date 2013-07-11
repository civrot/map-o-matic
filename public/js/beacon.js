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

var Beacon = function (data, foo) {
	this.address = data.address;
	this.coords = getCoords(this.address, foo);
	this.bubble = data.imageUrl;
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
	  .style("fill", "none")
	  .style("stroke", "red")
	  .style("stroke-opacity", 1e-6)
	  .style("stroke-width", 3)
	  .transition()
	  .duration(750)
	  .attr("r", 42)
	  .style("stroke-opacity", 1)
		.remove();

	//Draw Circle
	svg.append("circle")
		.data(coords)
		.attr("cx", coords[0])
		.attr("cy", coords[1])
		.attr("r", 5)
		.attr("class", "blip")
		.style("fill", 'red')
		.append("div")
		.style("height", "100px")
		.style("width", "100px")
		.style("fill", "red");

	//Flash image of product
	svg.append("svg:image")
    .attr("xlink:href", "http://d1smo01m4xb9gu.cloudfront.net/production/brands/element-eden/shannon-tank_w_teal/front-9a0294-grid.jpg")
    .attr("x", coords[0])
    .attr("y", coords[1])
    .attr("width", "100")
    .attr("height", "100")
    .transition()
	  .duration(1750)
	  .style("opacity", 0)
	  .remove();
};

Beacon.prototype.destroy = function () {
	svg.selectAll("circle")
		.data(bl.dataList)
		.exit()
		.remove();
};