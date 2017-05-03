'use strict'
const rev = require('./reversi.js');
const readlineSync = require('readline-sync');
const fs = require('fs');

console.log('REVERSI?\n');
let p = prompt();
let game = play(p.board, p.width, p.player, p.computer, p.playerTurn);
getScore(game.b, game.p);




function prompt(){
	let width = 0;
	do{
		width = readlineSync.question("How wide should the board be? (even numbers between 4 and 26, inclusive)\n> ");
	} while (width < 4 || width > 26 || width%2 !== 0); 

	let player = '';
	let computer = 'O';
	do{
		player = readlineSync.question("Pick your letter: X (black) or O (white)\n> ");
	} while (player !== 'X' && player !== 'O');

	console.log("Player is", player);

	let board = rev.generateBoard(width, width, " ");
	board = rev.setBoardCell(board, "O", width/2 - 1, width/2 - 1);
	board = rev.setBoardCell(board, "O", width/2, width/2);
	board = rev.setBoardCell(board, "X", width/2, width/2 - 1);
	board = rev.setBoardCell(board, "X", width/2 - 1, width/2);

	let playerTurn = true; // false means X's turn, true means O's turn
	if (player === "O"){
		playerTurn = false;
		computer = 'X';
	}

	console.log(rev.boardToString(board));
	return {board:board, width:width, player:player, computer:computer, playerTurn:playerTurn}
}

function play(board, width, player, computer, playerTurn){
	let pass = 0;
	while (!rev.isBoardFull(board) && pass < 2){
		if (!playerTurn){
			const validMoves = rev.getValidMoves(board, computer);
			if (validMoves.length > 0){
				readlineSync.question("Press <ENTER> to show computer's move...");
				const index = Math.floor(Math.random() * (validMoves.length)); 
				const randomMove = validMoves[index];
				board = rev.setBoardCell(board, computer, randomMove[0], randomMove[1]);
				board = rev.flipCells(board, rev.getCellsToFlip(board, randomMove[0], randomMove[1]));
				pass = 0;
			}else{
				readlineSync.question("No valid moves. Computer passes. Press any key.\n ");
				pass++;
				if (pass === 2) {console.log("game over");}
				playerTurn = !playerTurn;
				continue;
			}
		}else if (playerTurn){
			const validMoves = rev.getValidMoves(board, player);
			if (validMoves.length  == 0){
				readlineSync.question("No valid moves. Press any key.\n ");
				pass++;
				if (pass === 2) {console.log("game over");}
				playerTurn = !playerTurn;
				continue;
			}
			let move = '';
			do{
				// console.log(validMoves);
				move = readlineSync.question("What's your move? ");
				if (rev.algebraicToRowCol(move) == undefined || !rev.isValidMoveAlgebraicNotation(board, player, move)){
					console.log("Invalid Move\n");
				}
			}while (rev.algebraicToRowCol(move) == undefined || !rev.isValidMoveAlgebraicNotation(board, player, move));
				const row = rev.algebraicToRowCol(move).row;
				const col = rev.algebraicToRowCol(move).col;
				// console.log(row, col);
				board = rev.setBoardCell(board, player, row, col);
				board = rev.flipCells(board, rev.getCellsToFlip(board, row, col));
				pass = 0;
		}
		console.log(rev.boardToString(board));
		playerTurn = !playerTurn;
		rev.printScore(board);
		// break;
	}return {b:board, p: player}
}
function getScore(board, player){
	const scores = rev.getLetterCounts(board);
	if (scores.X === scores.O){
		console.log("It's a tie!");
	}else if(scores.X > scores.O){
		if (player === 'X'){
			console.log("You win!");
		}else{
			console.log("Computer wins!");
		}
	}else if(scores.O > scores.X){
		if (player === 'O'){
			console.log("You win!");
		}else{
			console.log("Computer wins!");
		}
	}
}