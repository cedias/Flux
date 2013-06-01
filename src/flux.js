function Flux(args){

	this.client_id = args.SCid;
	SC.initialize({client_id:this.client_id});

	this.streams = [];
	this.tracksLoaded = 0;
	this.currentTrack = 0;

	this.totalTracks = args.links.length;
	this.autoplay = args.autoplay;
	this.continuous = args.continuous;
	this.tracks = this._linksToTracklist(args.links); // /!\ asynchronous

}

/*resolves a soundcloud track url's array*/
Flux.prototype._linksToTracklist = function(list){
	var tracks = [];
	var self = this;

	for(var i=0;i<list.length;i++){
		SC.get("http://api.soundcloud.com/resolve",{url:list[i]}, function(track){
			if(track.errors === undefined && track.kind === "track"){
				tracks.push(track);
				self._trackToStream(track);
			}
			else
			{
				console.log("Wrong Soundcloud link");
				self.totalTracks--;
			}
		});
	}
	return tracks;
}

Flux.prototype._trackToStream = function(track) {
	var self = this;
	var params = {}

	if(this.continuous)
		params.onfinish = function(){self.nextSong()};

	SC.stream("/tracks/"+track.id, params, function(sound){
  		self.streams.push(sound);
  		self.tracksLoaded++;

  		if(self.tracksLoaded === self.totalTracks && self.autoplay){
  			self.togglePlay();
  		}
	});
};


/**			Controls			**/

Flux.prototype.stop = function() {
	this.streams[this.currentTrack].stop();
	this.streams[this.currentTrack].setPosition(0);
};

Flux.prototype.togglePlay = function(){

	this.streams[this.currentTrack].togglePause();
	console.log("play:"+this.currentTrack);
};

Flux.prototype.setVolume = function(volume){

	if(volume >=0 && volume <= 100)
		this.streams[this.currentTrack].setVolume(volume);
	else
		console.log("Error: volume [0;100] you gave "+volume);
};

Flux.prototype.nextSong = function(){

	this.stop();
	this.currentTrack = (this.currentTrack+1)%this.totalTracks;

	if(this.autoplay)
		this.togglePlay();
};

Flux.prototype.previousSong = function(){

	this.stop();
	if(this.currentTrack !== 0)
		this.currentTrack--;
	else
		this.currentTrack = this.totalTracks-1;

	if(this.autoplay)
		this.togglePlay();
};

Flux.prototype.goToSong = function(song) {

	this.stop();
	if(song >= 0 && song <= this.totalTracks-1)
		this.currentTrack = song
	else
		console.log("Error: wrong song number");

	if(this.autoplay)
		this.togglePlay();
};

Flux.prototype.goToXSec = function(time){

	this.streams[this.currentTrack].setPosition(time*1000);
};