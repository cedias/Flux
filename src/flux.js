function Flux(args){

	this.client_id = args.SCid;
	SC.initialize({client_id:this.client_id});
	this.tracksLoaded = 0;
	this.totalTracks = args.links.length;
	this.tracks = this._linksToTracklist(args.links); // /!\ asynchronous
	this.currentTrack = 0;

}


Flux.prototype._linksToTracklist = function(list){
	var tracks = [];
	var self = this;

	for(var i=0;i<list.length;i++){
		SC.get("http://api.soundcloud.com/resolve",{url:list[i]}, function(resp){
			self.tracksLoaded++;
			if(resp.errors === undefined && resp.kind === "track")
				tracks.push(resp);
			else
				console.log("Wrong Soundcloud link");
		});
	}
	return tracks;
}

Flux.prototype.togglePlay = function(){

};

Flux.prototype.setVolume = function(volume){};

Flux.prototype.nextSong = function(){};

Flux.prototype.previousSong = function(){};

Flux.prototype.goToXSec = function(time){};