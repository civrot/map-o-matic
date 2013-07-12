var doStuff = function (data) {
	var blip, obj;
	blip = new Beacon(data);
  populateLastItem(blip);
  populateSalesFeed(blip);
  $(".sales-counter").text(bl.beacons.length.toString());
	blip.createBlip();
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

