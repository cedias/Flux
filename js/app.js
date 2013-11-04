
var app;

$(
    app = function(){
	
	var lis = $(".track");
	var urls = [];

	for(var i=0;i<lis.length;i++)
	    urls.push($(lis[i]).html());

	//options
	var player = new Flux({
	    SCid : "3f45abb44a7e483b35d0b04047849967",
	    links : urls,
	    autostart : false,
	    autoplay : true,
	    repeat : true,
	    debug:true,
	    onfinish:function(){switchInfo(player.currentStream)}
	});

    	/*Play button*/
	$("#play").on('click', function(){
	    player.togglePlay();
	    if($(".active").length == 0){
		$(".track:eq(0)").addClass("active");
		switchInfo(0);
	    }
	});

	/*Next button*/
	$("#next").on('click',function(){
	    switchInfo(player.next());
	    
	});

	/*Previous button*/
	$("#previous").on('click',function(){
	    switchInfo(player.previous());
	});


	/*List choosing*/
	var items =  $('.track').on('click',function() {
	    var index = items.index(this);
	    player.selectStream(index);
	    switchInfo(index);
	    
	});


	function switchInfo(index){
	    var li = $(".track:eq("+index+")");
	    $(".active").removeClass("active");
	    li.addClass("active");
	    $("#playing").html("<b>Playing:</b> <a href=\""+li.html()+"\">"+li.html()+"</a>");

	}

    });