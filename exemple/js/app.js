
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

	/*Add Link*/
	$("#add_link_form").on('submit',function() {

		var link = $("#link_to_add").val();
		if(link!==""){
		player.addStream(link);
		addLinkHTML(link);
		$("#link_to_add").val("");
		}
		return false;
	});

	/*Check Links*/
	$("#check_links").on('click',findNonWorkingStreams);

	function findNonWorkingStreams(){
		var errors = player.getErrorStreams();
		var i;
		for(i=0;i<errors.length;i++){
			highlightErrors(errors[i]);
		}
		console.log(errors);
		return false;
	}

	function highlightErrors(index){
		$($('.track')[index]).addClass("noStream");
	}


	function switchInfo(index){
	    var li = $(".track:eq("+index+")");
	    $(".active").removeClass("active");
	    li.addClass("active");
	    $("#playing").html("<b>Playing:</b> <a href=\""+li.html()+"\">"+li.html()+"</a>");

	}
	function addLinkHTML(link){
		$("#tracks").append("<li class=\"list-group-item track\">"+link+"</li");

		$('.track').off('click')
		var items =  $('.track').on('click',function() {
	    var index = items.index(this);
	    player.selectStream(index);
	    switchInfo(index);
	    
	});
	};



    });