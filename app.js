var context;
var shape = new Object();
var board = new Array();
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var clockInterval;
var coinInterval;
var myMusic = new Audio("music\\pacman_beginning.wav");
var musicEat =new Audio("music\\pacman_chomp.wav");
var musicExtra  = new Audio("music/Extra.mp3");
var backMusic= new Audio("music\\Pac-Man Fever (Eat Em Up) 2015.mp3");
var musicDead = new Audio("music/Death.mp3");
var musicEnd  = new Audio("music/sad.mp3");
var firstMouth;
var secMouth;
var firstBall;
var secBall;
var lifesRemain;
var pill;
var pillTime;
var prevCoinValue;
var dead;
var food_remain;

$(document).ready(function() {
	context = canvas.getContext("2d");
	firstMouth = 0.15; secMouth = 1.85, firstBall = 5, secBall = -15;
});

function Start() {
	console.log("start");
	pill = document.getElementById("pill");
	musicEat.volume = 0.1;
	backMusic.volume = 0.1;
	backMusic.loop = true;
	pillTime = null;
	prevCoinValue =0;
	board = new Array();
	score = 0;
	dead = false;
	lifesRemain = 5;
	pac_color = "yellow";
	var cnt = 100;
	food_remain = sessionStorage.getItem("numOfBalls");
	var points5_remain=food_remain*0.6;
	var points15_remain=food_remain*0.3;
	var points25_remain=food_remain*0.1;
	var pacman_remain = 1;

	for (var i = 0; i < 15; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 9 && j == 3) ||
				(i == 9 && j == 4) ||
				(i == 9 && j == 5) ||
				(i == 8 && j == 5) ||
				(i == 10 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2) ||
				(i == 2 && j == 1) ||
				(i == 3 && j == 1) ||
				(i == 13 && j == 8) ||
				(i == 13 && j == 7) ||
				(i == 12 && j == 8) ||
				(i == 13 && j == 3) ||
				(i == 14 && j == 3) ||
				(i == 2 && j == 7) ||
				(i == 2 && j == 8) ||
				(i == 1 && j == 7) ||
				(i == 3 && j == 7)
			) { // walls
				board[i][j] = 4;
			}  else if(i==1 && j==8 || i==1 && j==1 || i==14 && j==2 || i==12 && j==7){ // pills
				board[i][j]= 5;
			}
			else if(i==7 && j==5){ // clock
				board[i][j]=6;
			}
			else if(i==0 && j==0){// coin
				board[i][j]=20;
			}
			else {
				board[i][j] = 0;
			}
		}
	}

	let cellForPacman = findRandomEmptyCell(board);
	shape.i = cellForPacman[0];
	shape.j = cellForPacman[1];
	board[cellForPacman[0]][cellForPacman[1]] = 2;
	pacman_remain--;	
	makeMonsters();
	while ((points25_remain+points15_remain+points5_remain) > 0) {
		var emptyCell = findRandomEmptyCell(board);
		if(points5_remain>0){
			board[emptyCell[0]][emptyCell[1]] = 1;
			points5_remain--;
		}
		else if(points15_remain>0){
			board[emptyCell[0]][emptyCell[1]] = 3;
			points15_remain--;
		}
		else{
			board[emptyCell[0]][emptyCell[1]] = 25;
			points25_remain--;
		}
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
	clockInterval = setInterval(showClock,5000);
	coinInterval = setInterval(UpdateCoinPosition,1000);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 14);
	var j = Math.floor(Math.random() * 10);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 14);
		j = Math.floor(Math.random() * 10);
	}
	return [i, j];
}

function GetKeyPressed() {
	var up=sessionStorage.getItem("up");
	var down=sessionStorage.getItem("down");
	var right=sessionStorage.getItem("right");
	var left=sessionStorage.getItem("left");
	if (keysDown[up]) {
		return 1;
	}
	if (keysDown[down]) {
		return 2;
	}
	if (keysDown[left]) {
		return 3;
	}
	if (keysDown[right]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLifes.value = lifesRemain;
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				rotatePacman();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = sessionStorage.getItem("ball5"); //color
				context.fill();
			} else if (board[i][j] == 3) {
				context.beginPath();
				context.arc(center.x, center.y, 20, 0, 2 * Math.PI); // circle
				context.fillStyle = sessionStorage.getItem("ball15"); //color
				context.fill();
			} else if (board[i][j] == 25) {
				context.beginPath();
				context.arc(center.x, center.y, 25, 0, 2 * Math.PI); // circle
				context.fillStyle = sessionStorage.getItem("ball25"); //color
				context.fill();
			} else if (board[i][j] == 4) {
				var my_gradient = context.createLinearGradient(0, 0, 0, 170);
				my_gradient.addColorStop(0, "#696969");
				my_gradient.addColorStop(1, "#9F9F9F");
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = my_gradient; //color
				context.lineWidth = 4;
				context.strokeStyle = "#009BFF";
				context.stroke();
				context.fill();
			} else if(board[i][j] == 5){
				context.drawImage(pill,center.x-55,center.y-25,120,120);
			} else if(board[i][j] == 6){
				context.drawImage(clock,center.x-30,center.y-30,60,60);
			} else if(board[i][j] == 7){
				context.drawImage(ghost1,center.x-30,center.y-30,60,60);
			} else if(board[i][j] == 8){
				context.drawImage(ghost2,center.x-30,center.y-30,60,60);
			} else if(board[i][j] == 9){
				context.drawImage(ghost3,center.x-30,center.y-30,60,60);
			} else if(board[i][j] == 10){
				context.drawImage(ghost4,center.x-30,center.y-30,60,60);
			}else if(board[i][j] == 20){
			context.drawImage(coin,center.x-30,center.y-30,60,60);
			}
		}
	}
}

function rotatePacman(){
	var x = GetKeyPressed();
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2  && x==1 ) { //up
				context.beginPath();
				context.arc(center.x, center.y, 30, -0.35* Math.PI,1.35* Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x +15, center.y - 5, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue" //color
				context.fill();
				firstMouth = -0.35, secMouth = 1.35, firstBall = 15; secBall = -5;
			}
			else if(board[i][j] == 2 && x==2){ //down
				context.beginPath();
				context.arc(center.x, center.y, 30, -1.35* Math.PI, 0.35* Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x -15, center.y + 5, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue" //color
				context.fill();
				firstMouth = -1.35, secMouth = 0.35, firstBall = -15; secBall = 5;
			}
			else if(board[i][j] == 2 && x==3){ //left
				context.beginPath();
				context.arc(center.x, center.y, 30, -0.85* Math.PI, 0.85* Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x -5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue" //color
				context.fill();
				firstMouth = -0.85, secMouth = 0.85, firstBall = -5; secBall = -15;
			}
			else if(board[i][j] == 2&& x==4) { // right
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15* Math.PI, 1.85* Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x +5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue" //color
				context.fill();
				firstMouth = 0.15, secMouth = 1.85, firstBall = 5; secBall = -15;
			}
			else if(board[i][j] == 2) { // non of the above
				context.beginPath();
				context.arc(center.x, center.y, 30, firstMouth* Math.PI, secMouth* Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + firstBall , center.y + secBall, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue" //color
				context.fill();
			}
		}
	}
}
function showClock(){
  board[7][5] = board[7][5] == 0 ? 6 : 0;
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 15 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score+=5;
		musicEat.play();
		food_remain--;
	}
	if (board[shape.i][shape.j] == 3) {
		score+=15;
		musicEat.play();
		food_remain--;
	}
	if (board[shape.i][shape.j] == 25) {
		score+=25;
		musicEat.play();
		food_remain--;
	}
	var currTime = new Date();
	if(pillTime!=null && (currTime - pillTime) / 1000 >=5){
		clearInterval(interval);
		interval = setInterval(UpdatePosition,250);
		pillTime = null;
	}
	if (pillTime == null && board[shape.i][shape.j] == 5) {
		pillTime = new Date();
		musicExtra.play();
		window.clearInterval(interval);
		interval = setInterval(UpdatePosition,100);
	}
	else if (board[shape.i][shape.j] == 5 && pillTime != null){
		if((currTime - pillTime) / 1000 <5){
			pillTime = new Date();
			musicExtra.play();
		}
	}
	else if(board[shape.i][shape.j] == 6){
		start_time = new Date(start_time.getTime() + 10*1000);
		clearInterval(clockInterval);
	}
	else if(board[shape.i][shape.j] == 7){
		looser1();
	}
	else if(board[shape.i][shape.j] == 8){
		looser2();
	}
	else if(board[shape.i][shape.j] == 9){
		looser3();
	}
	else if(board[shape.i][shape.j] == 10){
		looser4();
	}
	else if(board[shape.i][shape.j] == 20){
		clearInterval(coinInterval);
		score = score+50;
	}
	if(dead){
		board[shape.i][shape.j] = 0;
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 2;
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		dead = false;
	}
	else{
		board[shape.i][shape.j] = 2;
	}
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	//var timeChosen = sessionStorage.getItem("time");
	var timeChosen = parseInt(sessionStorage.getItem("time"));
	if(time_elapsed>=timeChosen){
		backMusic.pause();
		backMusic.currentTime = 0;
		clearIntervals();
		showFinalResults();
		if(score<100){
			setTimeout(function(){ window.alert("you are better than " + score + " points!");}, 500);
		}
		else{
			setTimeout(function(){ 	window.alert("Winner!!!");}, 500);
		}
	}
	if (food_remain==0) {
		clearIntervals();
		window.alert("Game completed");
		backMusic.pause();
		backMusic.currentTime = 0;
	} else {
		Draw();
		rotatePacman();
	}
}


function clearIntervals(){
	if (typeof(interval) !== 'undefined')
		clearInterval(interval);
	if (typeof(clockInterval) !== 'undefined')
		clearInterval(clockInterval);
	if (typeof(ghost1Interval) !== 'undefined') 
		clearInterval(ghost1Interval);
	if (typeof(ghost2Interval) !== 'undefined') 
		clearInterval(ghost2Interval);
	if (typeof(ghost3Interval) !== 'undefined') 
		clearInterval(ghost3Interval);
	if (typeof(ghost4Interval) !== 'undefined') 
		clearInterval(ghost4Interval);
	if (typeof(coinInterval) !== 'undefined') 
		clearInterval(coinInterval);
}

function UpdateCoinPosition(){
	var x = Math.floor(Math.random() * 4 + 1);
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 10; j++) {
			if(board[i][j]==20){
				board[i][j]=prevCoinValue;
				while(true){
				if(x==1 && j+1<10 && board[i][j+1]!=4 ){
					prevCoinValue = board[i][j+1];
					board[i][j+1]=20;
					return;
				}
				else if(x==2 && i+1<15 && board[i+1][j]!=4){
					prevCoinValue = board[i+1][j];
					board[i+1][j]=20;
					return;
				}
				else if(x==3 && j-1>0 && board[i][j-1]!=4){
					prevCoinValue = board[i][j-1];
					board[i][j-1]=20;
					return;
				}
				else if(x==4 && i-1>0 && board[i-1][j]!=4){
					prevCoinValue = board[i-1][j];
					board[i-1][j]=20;
					return;
				}
				else x = Math.floor(Math.random() * 4 + 1);
			}
			}
		}
	}
}

function showFinalResults(){
	$("#lblFinalScore").show();
	$('#lblFinalScore').append("Your final score is: "+ score);
}

function checkIfDead(){
	if(lifesRemain-1 == 0){
		showFinalResults();
		lblLifes.value = 0;
		musicEnd.play();
		clearIntervals();
		setTimeout(function(){ alert("Loser!"); }, 500);
		backMusic.pause();
		backMusic.currentTime = 0;
	}
	else{
		clearInterval(interval);
		interval = setInterval(UpdatePosition,250);
		lifesRemain--;
		dead = true;
		score = score -10;
	} 
}

function isPacmanNear(i,j){
	for(var x = 0; x <15; x++){
		for(var y = 0; y < 10; y++){
			if(board[x][y]==2){
				if(x<i && y<j){
					var rand = Math.floor(Math.random() * 1 + 1);
					if(rand == 0 && board[i-1][j]!=4){
						return[-1,0];
					}
					else if(rand==1 && board[i][j-1]!=4){
						return[0,-1];
					}
				}
				if(x>i && y<j){
					var rand = Math.floor(Math.random() * 1 + 1);
					if(rand == 0 && board[i+1][j]!=4){
						return[1,0];
					}
					else if(rand==1 && board[i][j-1]!=4){
						return[0,-1];
					}
				}
				if(x<i && y>j){
					var rand = Math.floor(Math.random() * 1 + 1);
					if(rand == 0 && board[i-1][j]!=4){
						return[-1,0];
					}
					else if(rand==1 && board[i][j+1]!=4){
						return[0,1];
					}
				}
				if(x>i && y>j){
					var rand = Math.floor(Math.random() * 1 + 1);
					if(rand == 0 && board[i+1][j]!=4){
						return[1,0];
					}
					else if(rand==1 && board[i][j+1]!=4){
						return[0,1];
					}
				}
				if(y<j &&board[i][j-1]!=4 )
				{
					return[0,-1];
				}
				else if(x>i && board[i+1][j]!=4)
				{
						return[1,0];
				}
				else if(y>j && board[i][j+1]!=4)
				{
						return[0,1];
				}
				else if(x<i &&board[i-1][j]!=4 ){
						return[-1,0];
				}
				else{
					var x = Math.floor(Math.random() * 4 + 1);
					while(true){
						if(x==1 && i+1<15 && board[i+1][j]!=4 ){
							return [1,0];
						}
						else if(x==2 && i-1>=0 && board[i-1][j]!=4){
							return[-1,0];
						}
						else if(x==3 && j+1<10 && board[i][j+1]!=4){
							return[0, 1];
						}
						else if(x==4 && j-1>=0 && board[i][j-1]!=4){
							return[0,-1];
						}
						else{
							x = Math.floor(Math.random() * 4 + 1);
						}
					}
				}
			}
		}
	}
	return[-2,-2];
}
