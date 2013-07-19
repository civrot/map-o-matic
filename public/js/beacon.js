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
	this.text = "+$" + Math.floor((Math.random()*250)+1).toString();
	this.size = 5;
	bl.beacons.push(this);
	//bl.expireOldBeacons();
};

Beacon.prototype.createBlip = function () {
	//Use D3 to create blip on map
	blip = this;
	coords = blip.coords;
	blipColor = "#00ccff";
	pingColor = "#FF6633";

	//Draw ping
	svg.append("circle")
	  .attr("cx", coords[0])
	  .attr("cy", coords[1])
	  .attr("r", 2)
	  .style("fill", pingColor)
	  .style("opacity", .6)
	  .style("stroke", pingColor)
	  .style("stroke-opacity", 1)
	  .style("stroke-width", 5)
	  .transition()
	  .duration(950)
	  .attr("r", 172)
	  .style("opacity", 0)
	  .style("stroke-opacity", 0)
		.remove();

	if(blip.text) {
		svg.append("text")
			.data(coords)
			.attr("x", coords[0] - 45)
	    .attr("y", coords[1])
	    .attr("class","blip-text")
	    .attr("fill", pingColor)
	    .text( function (d) { return blip.text; })
	    .transition()
		  .duration(1500)
		  .attr("x", coords[0] - 45)
	    .attr("y", coords[1] - 90)
		  .style("opacity", 0)
		  .remove();
	}

	if(blip.imageUrl != "") {
		//Draw image triangle
	  svg.append('path')
	    .attr('d', function(d) {
	      var x = coords[0], y = coords[1] + 10;
	      return 'M ' + x +' '+ y + ' l 10 10 l -20 0 z';
	    })
	    .attr("fill", blipColor)
	    .transition()
	    .duration(500)
	    .delay(1000)
	    .style("opacity", 0)
	    .remove();

	  //Draw image border box
		svg.append("rect")
			.attr("x", coords[0] - 41)
	    .attr("y", coords[1] + 19)
	    .attr("width", "82")
	    .attr("height", "108")
	    .attr("fill", blipColor)
	    .transition()
	    .duration(500)
	    .delay(1000)
	    .style("opacity", 0)
	    .remove();

	  //Draw image
		svg.append("svg:image")
	    .attr("xlink:href", this.imageUrl)
	    .attr("x", coords[0] - 50)
	    .attr("y", coords[1] + 22)
	    .attr("width", "100")
	    .attr("height", "100")
	    .style("opacity", .90)
	    .transition()
	    .duration(500)
	    .delay(1000)
	    .style("opacity", 0)
	    .remove();
  }

 	//Draw Circle
	svg.append("circle")
		.data(coords)
		.attr("cx", coords[0])
		.attr("cy", coords[1])
		.attr("r", blip.size)
		.attr("class", "blip")
		.style("fill", blipColor)
		.style("stroke", "#000000")
		.style("stroke-width", 2);
};

Beacon.prototype.detectCollision = function(callback) {
	var radians = [0.78, 1.57, 2.36, 3.14, 3.92, 4.71, 5.5, 0],
			b = document.elementFromPoint(this.coords[0], this.coords[1]),
			x, y;
	if($(b).is("circle")) {
		callback(this, b);
	}
	for(var i = 0; i < radians.length; i++) {
		b = null;
		dx = Math.cos(radians[i]) * this.size;
		dy = Math.sin(radians[i]) * this.size;
		b = document.elementFromPoint(this.coords[0] + dx, this.coords[1] + dy);
		if($(b).is("circle")) {
			callback(this, b);
		}
	}

}

// Beacon.prototype.destroy = function () {
// 	blipData = bl.dataList();
// 	var c = svg.selectAll("circle").data(blipData, function(d) { return(d); });
// 	c.exit().remove();
// };
