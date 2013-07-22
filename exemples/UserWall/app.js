var client_id = "7915edfa22afa94d3b3bba43fab6b0dd";
var user = "charlymex";
var flux;

SC.initialize({
    client_id: client_id
  });

var url = "http://soundcloud.com/"+user

SC.get("http://api.soundcloud.com/resolve.json",{"url":url}, function(user){
	SC.get("/users/"+user.id+"/favorites",{"limit":54}, function(tracks){
	  var permalinks = [];

	  for (var i = 0; i < tracks.length; i++) {
	  	if(tracks[i].artwork_url !== null )
	  		addArtwork(tracks[i].artwork_url);
	  	else
	  		addArtwork(tracks[i].user.avatar_url);
	  	permalinks.push(tracks[i].permalink_url);
	  };

	  init_flux(permalinks);

	});
});

function init_flux (permalinks) {
	var args = {
		SCid : "7915edfa22afa94d3b3bba43fab6b0dd",
		links : permalinks,
		autoplay : true,
		continuous : false,
	};

	flux = new Flux(args);
	
}

function addArtwork(url) {
	$("#images").append("<img src="+url+"/>");
}

$("#pp").on("click", function(){flux.togglePlay()});
$("#previous").on("click", function(){flux.previousSong()});
$("#next").on("click", function(){flux.nextSong()});

