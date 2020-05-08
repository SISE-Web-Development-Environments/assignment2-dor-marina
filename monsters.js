var ghost1Interval;
var ghost2Interval;
var ghost3Interval;
var ghost3Interval;
var prevValueGhost1=0;
var prevValueGhost2=0;
var prevValueGhost3=0;
var prevValueGhost4=0;

function makeMonsters(){
	// var numOfMonsters = sessionStorage.getItem("Monsters");
	var numOfMonsters = 2;
	if(numOfMonsters == 1){
		board[14][9] = 7;
        board[0][0] = 20;
        ghost1Interval = setInterval(UpdateMonster1Position,500);
	}
	else if(numOfMonsters == 2){
		board[14][9] = 7;
		board[0][0] = 8;
        board[14][0] = 20;
        ghost1Interval = setInterval(UpdateMonster1Position,500);
        ghost2Interval = setInterval(UpdateMonster2Position,500);
	}
	else if(numOfMonsters == 3){
		board[14][9] = 7;
		board[0][0] = 8;s
		board[0][9] = 9;
        board[14][0] = 20;
        ghost1Interval = setInterval(UpdateMonster1Position,500);
        ghost2Interval = setInterval(UpdateMonster2Position,500);
        ghost3Interval = setInterval(UpdateMonster3Position,500);
    }
	else{
		board[14][9] = 7;
		board[0][0] = 8;
		board[0][9] = 9;
		board[14][0] = 10;
        board[7][0] = 20;
        ghost1Interval = setInterval(UpdateMonster1Position,500);
        ghost2Interval = setInterval(UpdateMonster2Position,500);
        ghost3Interval = setInterval(UpdateMonster3Position,500);
        ghost4Interval = setInterval(UpdateMonster4Position,500);
	}
}
//------------monster1--------------
function UpdateMonster1Position(){
	var x = Math.floor(Math.random() * 3 + 1);
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 10; j++) {
			if(board[i][j]==7){
				board[i][j]=prevValueGhost1;
				var pacmanCell = isPacmanNear(i,j);
				if(board[i+pacmanCell[0]][j+pacmanCell[1]] == 2){
					looser1();
					return;
				}
				else{
					prevValueGhost1 = board[i+pacmanCell[0]][j+pacmanCell[1]];
					board[i+pacmanCell[0]][j+pacmanCell[1]] = 7;
					return;
				}
			}
		}
	}
}
function looser1(){
    if(prevValueGhost1 == 10){
        board[14,0]=10;
    }
    else if (prevValueGhost1 == 8){
        board[0,0]=8;
    }
    else if (prevValueGhost1 == 9){
        board[0,9]=9;
    }
    prevValueGhost1=0;
	musicDead.play();
	console.log("you met a monster");
	dead=true;
	board[14][9]=7;
	checkIfDead();
}

//------------monster2--------------
function UpdateMonster2Position(){
	var x = Math.floor(Math.random() * 3 + 1);
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 10; j++) {
			if(board[i][j]==8){
				board[i][j]=prevValueGhost2;
				var pacmanCell = isPacmanNear(i,j);
				if(board[i+pacmanCell[0]][j+pacmanCell[1]] == 2){
					looser2();
					return;
				}
				else{
					prevValueGhost2 = board[i+pacmanCell[0]][j+pacmanCell[1]];
					board[i+pacmanCell[0]][j+pacmanCell[1]] = 8;
					return;
				}
			}
		}
	}
}
function looser2(){
    if(prevValueGhost2 == 7){
        board[14,9]=7;
    }
    else if (prevValueGhost2 == 10){
        board[14,0]=10;
    }
    else if (prevValueGhost2 == 9){
        board[0,9]=9;
    }
    prevValueGhost2=0;
	musicDead.play();
	console.log("you met a monster");
	dead=true;
	board[0][0]=8;
	checkIfDead();
}

//------------monster3--------------
function UpdateMonster3Position(){
	var x = Math.floor(Math.random() * 3 + 1);
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 10; j++) {
			if(board[i][j]==9){
				board[i][j]=prevValueGhost3;
				var pacmanCell = isPacmanNear(i,j);
				if(board[i+pacmanCell[0]][j+pacmanCell[1]] == 2){
					looser3();
					return;
				}
				else{
					prevValueGhost3 = board[i+pacmanCell[0]][j+pacmanCell[1]];
					board[i+pacmanCell[0]][j+pacmanCell[1]] = 9;
					return;
				}
			}
		}
	}
}
function looser3(){
    if(prevValueGhost3 == 7){
        board[14,9]=7;
    }
    else if (prevValueGhost3 == 8){
        board[0,0]=8;
    }
    else if (prevValueGhost3 == 10){
        board[14,0]=10;
    }
    prevValueGhost3=0;
	musicDead.play();
	console.log("you met a monster");
	dead=true;
	board[0][9]=9;
	checkIfDead();
}

//------------monster4--------------
function UpdateMonster4Position(){
	var x = Math.floor(Math.random() * 3 + 1);
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 10; j++) {
			if(board[i][j]==10){
				board[i][j]=prevValueGhost4;
				var pacmanCell = isPacmanNear(i,j);
				if(board[i+pacmanCell[0]][j+pacmanCell[1]] == 2){
					looser4();
					return;
				}
				else{
					prevValueGhost4 = board[i+pacmanCell[0]][j+pacmanCell[1]];
					board[i+pacmanCell[0]][j+pacmanCell[1]] = 10;
					return;
				}
			}
		}
	}
}
function looser4(){
    if(prevValueGhost4 == 7){
        board[14,9]=7;
    }
    else if (prevValueGhost4 == 8){
        board[0,0]=7;
    }
    else if (prevValueGhost4 == 9){
        board[0,9]=9;
    }
    prevValueGhost4=0;
	musicDead.play();
	console.log("you met a monster");
	dead=true;
	board[14][0]=10;
	checkIfDead();
}