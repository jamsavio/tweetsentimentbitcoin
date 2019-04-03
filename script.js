$(document).ready(function() {
	/** generate the random number */
	var getRndInteger = function(min,max){
		return Math.floor(Math.random()*(max-min+1))+min;
	};

	var fbReactions = ["like","love","happy","yay","wow","sad","angry"];
	var sentimentos = [];

	//////////////////////////////////////
	var socket = io.connect('35.236.96.196:8888');

	socket.on('connect', function() {
		console.log("Connected");
	});
	
	socket.on('othermouse', function (data) {
		var feel;
		if (data <= -0.5) feel = 6;
		else if(data > -0.5 && data <= -0.3) feel = 5;
		else if(data > -0.3 && data < 0) feel = 4;
		else if(data == 0) feel = 0;
		else if(data > 0 && data < 0.3) feel = 3;	
		else if(data >= 0.3 && data < 0.5) feel = 2;
		else if(data >= 0.5) feel = 1;
		animacao(feel); //emojis
	});
	//////////////////////////////////////
	
	socket.on('velocimetro_porcentagem', function (media) {
		sessionStorage.setItem("media", media);
	});

	function animacao(feel){
		$(".particlesContainer").append(
			"<span class='particle " + 
				fbReactions[feel] + 
			"'></span>"
		);
		
		$(".particle").toArray().forEach(function(particle){
				$(particle).animate({
					left:getRndInteger(850,1220),
					right:0
				},1,function(){
					$(particle).animate({
						top:-100+"%",
						opacity:0
					},getRndInteger(5000,8000),function(){
						$(particle).remove();
					}); //inside animation function
			});/**first animate function */		
		});

		$(window).blur(function() {
    			$('.particlesContainer').empty();
 	        });
	}
});

