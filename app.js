var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var myMusic;
var musicEat;
var musicExtra;
var backMusic;
var firstMouth;
var secMouth;
var firstBall;
var secBall;
var lifesRemain;
var pill;
var pillTime;

$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
	firstMouth = 0.15; secMouth = 1.85, firstBall = 5, secBall = -15;
});

function Start() {
	pill = document.getElementById("pill");
	myMusic = new Audio("music\\pacman_beginning.wav");
	musicEat = new Audio("music\\pacman_chomp.wav");
	backMusic = new Audio("music\\Pac-Man Fever (Eat Em Up) 2015.mp3");
	musicExtra = new Audio("music/Extra.mp3");
	musicEat.volume = 0.5;
	backMusic.volume = 0.1;
	backMusic.loop = true;
	pillTime = null;
	board = new Array();
	score = 0;
	lifesRemain = 5;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 2 && j == 5) ||
				(i == 4 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2) ||
				(i == 2 && j == 1) ||
				(i == 3 && j == 1) ||
				(i == 8 && j == 8) ||
				(i == 8 && j == 7) ||
				(i == 7 && j == 8) ||
				(i == 8 && j == 3) ||
				(i == 9 && j == 3) ||
				(i == 2 && j == 7) ||
				(i == 2 && j == 8) ||
				(i == 1 && j == 7) ||
				(i == 3 && j == 7)
			) { // walls
				board[i][j] = 4;
			}  else if(i==0 && j==9 || i==0 && j==0 || i==9 && j==0 || i==9 && j==9){ // pills
				board[i][j]= 5;
			}
			else if(i==5 && j==5){ // clock
				board[i][j]=6;
			}
			 else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
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
	// if(interval!=null){
	// clearInterval(interval);
	// }
	interval = setInterval(UpdatePosition, 250);
	setInterval(showClock,5000);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLifes.value = lifesRemain;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				rotatePacman();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue"; //color
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
				var clockShowTime = new Date();
				context.drawImage(clock,center.x-30,center.y-30,60,60);
			}
		}
	}
}

function rotatePacman(){
	var x = GetKeyPressed();
	for (var i = 0; i < 10; i++) {
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
  board[5][5] = board[5][5] == 0 ? 6 : 0;
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	var bool = false;
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
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
		musicEat.play();
	}
	var currTime = new Date();
	if(pillTime!=null && (currTime - pillTime) / 1000 >=5){
		console.log("its been more then 5 sec at speed");
		console.log(interval);
		clearInterval(interval);
		interval = setInterval(UpdatePosition,250);
		pillTime = null;
	}
	if (pillTime == null && board[shape.i][shape.j] == 5) {
		pillTime = new Date();
		musicExtra.play();
		window.clearInterval(interval);
		interval = setInterval(UpdatePosition,100);
		console.log("its first pill");
		console.log(pillTime);
	}
	else if (board[shape.i][shape.j] == 5 && pillTime != null){
		if((currTime - pillTime) / 1000 <5){
			console.log("its second pill in less then 5 sec");
			console.log((currTime - pillTime) / 1000);
			pillTime = new Date();
			musicExtra.play();
		}
		else{
			// console.log("its second pill after 5 sec");
			// pillTime = new Date();
			// musicExtra.play();
			// setInterval(UpdatePosition,100);
		}
	}
	else if(board[shape.i][shape.j] == 6){
		console.log(start_time.getTime());
		start_time = new Date(start_time.getTime() + 10*1000);
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
		backMusic.pause();
		backMusic.currentTime = 0;
	} else {
		Draw();
		rotatePacman();
	}
}
