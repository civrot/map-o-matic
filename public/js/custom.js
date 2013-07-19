var doStuff = function (data) {
	var blip, obj;
	blip = new Beacon(data);
  populateLastItem(blip);
  populateSalesFeed(blip);
  $(".sales-counter").text(bl.beacons.length.toString());
  $("#footer-text").text(blip.address);
	blip.detectCollision(combineTouchingBlips);
	blip.createBlip();
	combineTouchingBlips(blip);
}

var combineTouchingBlips = function (blip, svgCircle) {
	if(blip.size > 15 || svgCircle == undefined)
		return;
	var radius = parseInt($(svgCircle).attr("r")),
		adjuster;
	if(radius !== undefined) {
		//Increase size by 1 past 20
		if(radius >= 20) {
			blip.size = radius + 1;
		} else {
			blip.size += radius;
			//If two 15s join they can only become a 20.
			if(blip.size >= 20)
				blip.size = 20;
		}
		svgCoords = getCoordsFromSVGCircle(svgCircle);
		//Set the new blips coordinates to the old one.
		blip.coords = svgCoords;
		$(svgCircle).remove();
		blip.detectCollision(combineTouchingBlips);
	}
}

//Get and return the coordsinates from an SVG circle objct
var getCoordsFromSVGCircle = function (circle) {
	var cx, cy;
	cx = parseFloat($(circle).attr("cx"));
	cy = parseFloat($(circle).attr("cy"));
	return [cx, cy];
}

var populateLastItem = function (blip) {
	$("#last-item .item").attr("src", blip.imageUrl);
	$(".address").html(blip.address);
}

var populateSalesFeed = function (blip) {
	var ul = $(".feed");
	if ($(".feed li").length >= 12) {
		$(".feed li:last-child").remove();
	}
	if($(".feed li").length > 0) {
		$(".feed li:first").before("<li><img src='" + blip.imageUrl + "' /></li>");
	} else {
		ul.append("<li><img src='" + blip.imageUrl + "' /></li>")
	}
}

