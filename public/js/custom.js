var doStuff = function (data) {
	var blip, obj;
	obj = {address: "no way dude", data: { bubble: "yeah"}};
	//blip = new Beacon(obj);

	blip = new Beacon(obj);
	populateCoordList(blip.coords)
  populateLastItem(blip);
	blip.createBlip();
	i = i + 1;
}

var populateCoordList = function (coords) {
	if ($("#coords p").length > 0){
    $("#coords p:first").before('<p>' + coords + '</p>');
  } else {
    $("#coords").append('<p>' + coords + '</p>');
  }
}

var populateLastItem = function (blip) {
	$("#last-item .item").attr("src", "http://d1smo01m4xb9gu.cloudfront.net/production/brands/element-eden/shannon-tank_w_teal/front-9a0294-grid.jpg")
}