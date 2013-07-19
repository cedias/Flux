function Flux(args){

	this.soundcloud_client_id = args.SCid;
	this.streams = [];
	this.tracksLoaded = 0;
	this.currentTrack = 0;
	SC.initialize({client_id:this.soundcloud_client_id});

	this.totalTracks = args.links.length;
	this.autoplay = args.autoplay;
	this.continuous = args.continuous;

	//Transform the links to streams
	this._linksToStreams(args.links); // /!\ asynchronous

}

/*Url array -> Stream array*/
Flux.prototype._linksToStreams = function(list){

	for(var i=0;i<list.length;i++){
		var stream = this._newStreamFromLink(list[i],i);
		this.streams.push(stream);
	}
}

Flux.prototype._newStreamFromLink = function(link,index){
	/*link is only soundcloud for now*/
	var args = {
		flux:this,
		url:link,
		index:index
	};
	return new Stream_Soundcloud(args);
}

Flux.prototype._eventManager = function(evt){
	if(evt.msg === "Loaded"){
		this.tracksLoaded++;
		if(evt.index === 0 && this.autoplay)
			this.togglePlay();
	}

	if(evt.msg === "Song Ended")
		this.nextSong();
}

/**			Controls			**/

Flux.prototype.stop = function() {
	this.streams[this.currentTrack].stop();
	this.streams[this.currentTrack].setPosition(0);
};

Flux.prototype.togglePlay = function(){

	this.streams[this.currentTrack].togglePlay();
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