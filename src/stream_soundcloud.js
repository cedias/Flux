function Stream_Soundcloud(args){

	this.flux = args.flux;
	this.stream_type = "Soundcloud";
	this.state = "created";
	this.client_id = args.flux.soundcloud_client_id;
	this.url = args.url;
	this.index = args.index;
	this.stream = undefined; //contains SC player, loaded asynchronously
	this._trackToStream(this.url);
}

/*resolves a soundcloud track url's array*/

Stream_Soundcloud.prototype._trackToStream = function(url) {
	var self = this;
	var params = {onfinish : function(){self.flux._eventManager({msg:"Song Ended",index:self.indexX})}};
	SC.get("http://api.soundcloud.com/resolve",{"url":url}, function(track){
			if(track.errors === undefined && track.kind === "track"){
				SC.stream("/tracks/"+track.id, params, function(sound){
  					self.stream = sound;
  					self.state = "loaded";
  					self.flux._eventManager({msg:"Loaded",index:self.index});
				});
			}
			else
			{
				self.state = "error";
				console.log("Wrong Soundcloud link");
			}
	});
};


/**			Controls			**/

Stream_Soundcloud.prototype.stop = function() {
	this.stream.stop();
	this.stream.setPosition(0);
};

Stream_Soundcloud.prototype.togglePlay = function(){
	this.stream.togglePause();
};

Stream_Soundcloud.prototype.setVolume = function(volume){

	if(volume >=0 && volume <= 100)
		this.stream.setVolume(volume);
	else
		console.log("Error: volume [0;100] you gave "+volume);
};

Stream_Soundcloud.prototype.setPosition = function(time){

	this.stream.setPosition(time*1000);
};