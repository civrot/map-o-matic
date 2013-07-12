var doStuff = function (data) {
	var blip, obj;
	blip = new Beacon(data);
	populateCoordList(blip.coords)
  populateLastItem(blip);
	blip.createBlip();
}

var populateCoordList = function (coords) {
	if ($("#coords p").length > 0){
    $("#coords p:first").before('<p>' + coords + '</p>');
  } else {
    $("#coords").append('<p>' + coords + '</p>');
  }
}

var populateLastItem = function (blip) {
	$("#last-item .item").attr("src", blip.imageUrl)
}
