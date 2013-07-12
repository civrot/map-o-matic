var doStuff = function (data) {
	var blip, obj;
	blip = new Beacon(data);
  populateLastItem(blip);
  $(".sales-counter").text(bl.beacons.length.toString());
	blip.createBlip();
}

var populateLastItem = function (blip) {
	$("#last-item .item").attr("src", blip.imageUrl);
	$(".address").html(blip.address);
}
