'use strict'
function repeat(value, n) {
    const arr = [];
    for (let x = 0; x < n; x++){
		arr.push(value);
    }return arr;
}

function generateBoard (rows, columns, initialCellValue){
	return repeat(initialCellValue, rows*columns);
}

function rowColToIndex(board, rowNumber, columnNumber){
	const sideLength = Math.sqrt(board.length);
	return (sideLength * rowNumber) + columnNumber;
}


function indexToRowCol(board, i){
	const sideLength = Math.sqrt(board.length);
	const remainder = i%sideLength;
	return {row: (i - remainder) / sideLength, col:remainder};
}

function setBoardCell(board, letter, row, col){
	const cellIndex = rowColToIndex(board, row, col);
	const newBoard = board.slice();
	newBoard[cellIndex] = letter;
	// console.log(board);
	return newBoard;
}

function algebraicToRowCol(algebraicNotation){
	const regexp = /[A-Z]\d+/;
	const matchedExpression = algebraicNotation.match(regexp);
	
	if (matchedExpression === null){
		return undefined;
	}

	const col = matchedExpression[0][0];
	const row = matchedExpression[0].substring(1);
	return {row:row - 1, col:col.charCodeAt(0)-65}; 	
}

function placeLetter(board, letter, algebraicNotation){
	const rowCol = algebraicToRowCol(algebraicNotation);
	return setBoardCell(board, letter, rowCol.row, rowCol.col);
}

function placeLetters(board, letter, algebraicNotation){
	for (let x = 2; x <= arguments.length-2; x++){
		board = placeLetter(board, letter, arguments[x]);
	}return placeLetter(board, letter, arguments[arguments.length-1]);
}

function boardToString(board){
	const sideLength = Math.sqrt(board.length);
	let stringified = "    ";
	let line = "   +";
	for (let x = 0; x < sideLength; x++){
		stringified += " " + String.fromCharCode(x+65) + "  ";
		line += "---+";
	}
	line += "\n";
	stringified += "\n" + line;

	let rowString = "";
	for (let x = 0; x < sideLength; x++){
		rowString = " " + (x+1) + " |";
		for (let y = 0; y < sideLength; y++){
			rowString += " " + board[rowColToIndex(board, x, y)] + " |";
		}stringified += rowString + "\n" + line;
	}
	return stringified;
}

function isBoardFull(board){
	return !board.some(x => x === " ");
}

function flip(board, row, col){
	let newBoard = board.slice();
	if (board[rowColToIndex(board, row, col)] === "X"){
		newBoard = setBoardCell(newBoard, "O", row, col);
	}else if (board[rowColToIndex(board, row, col)] === "O"){
		newBoard = setBoardCell(newBoard, "X", row, col);
	}return newBoard;
}

function flipCells(board, cellsToFlip){
	let newBoard = board.slice();
	for (let x = 0; x < cellsToFlip.length; x++){
		for (let y = 0; y < cellsToFlip[x].length; y++){
			newBoard = flip(newBoard, cellsToFlip[x][y][0], cellsToFlip[x][y][1]);
		}
	}return newBoard;
}

function getDirectionalFlip(board, value, lastRow, lastCol, xDir, yDir){
	// console.log(value, lastRow, lastCol, xDir, yDir);
	const sideLength = Math.sqrt(board.length);
	const flip = []
	let inBounds = true;
	while (inBounds){
		lastRow += yDir;
		lastCol += xDir;
		if (lastRow < 0 || lastCol < 0 || lastRow === sideLength || lastCol === sideLength){
			inBounds = false;
			return[];
		}
		if (board[rowColToIndex(board, lastRow, lastCol)] === " ") {return [];}
		if (board[rowColToIndex(board, lastRow, lastCol)] === value) {break;}
		flip.push([lastRow, lastCol]);
	}return flip;
}

function getCellsToFlip(board, lastRow, lastCol){
	const sideLength = Math.sqrt(board.length);
	const result = [];
	const value = board[rowColToIndex(board, lastRow, lastCol)];

	const directions = [];	

	directions.push(getDirectionalFlip(board, value, lastRow, lastCol, -1, 0));
	directions.push(getDirectionalFlip(board, value, lastRow, lastCol, +1, 0));
	directions.push(getDirectionalFlip(board, value, lastRow, lastCol, 0, -1));
	directions.push(getDirectionalFlip(board, value, lastRow, lastCol, 0, +1));
	directions.push(getDirectionalFlip(board, value, lastRow, lastCol, -1, -1));
	directions.push(getDirectionalFlip(board, value, lastRow, lastCol, +1, +1));
	directions.push(getDirectionalFlip(board, value, lastRow, lastCol, -1, +1));
	directions.push(getDirectionalFlip(board, value, lastRow, lastCol, +1, -1));
	
	for (const i in directions){
		if (directions[i].length > 0){
			result.push(directions[i]);
		}
	}

	return result;
}

function isValidMove(board, letter, row, col){
	const sideLength = Math.sqrt(board.length);
	if (row > sideLength || col > sideLength){
		return false;
	}if (board[rowColToIndex(board, row, col)] !== " "){
		return false;
	}
	const newBoard = board.slice();
	newBoard[rowColToIndex(board, row, col)] = letter;
	const flipped = getCellsToFlip(newBoard, row, col);
	if (flipped.length === 0) {return false;}
	if (flipped.length > 0) {return true;}
}

function isValidMoveAlgebraicNotation(board, letter, algebraicNotation){
	const rowCol = algebraicToRowCol(algebraicNotation);
	// console.log(rowCol);
	return isValidMove(board, letter, rowCol.row, rowCol.col);
}

function getLetterCounts(board){
	let numX = 0;
	let numO = 0;
	for(const i in board){
		if (board[i] === "X") {numX++;}
		if (board[i] === "O") {numO++;}
	}
	return {X:numX, O:numO};
}

function getValidMoves(board, letter){
	const validMoves = [];
	for (const i in board){
		if (isValidMove(board, letter, indexToRowCol(board, i).row, indexToRowCol(board, i).col)){
			validMoves.push([indexToRowCol(board,i).row, indexToRowCol(board,i).col]);
		}
	}
	return validMoves;
}

function printScore(board){
	const letterCounts = getLetterCounts(board);
	console.log("Score\n=====\nX: ", letterCounts.X, "\nO: ", letterCounts.O, "\n");
}

module.exports = {
	repeat: repeat,
	generateBoard: generateBoard,
	rowColToIndex: rowColToIndex,
	indexToRowCol: indexToRowCol,
	setBoardCell: setBoardCell,
	algebraicToRowCol: algebraicToRowCol,
	placeLetter: placeLetter,
	placeLetters: placeLetters,
	boardToString: boardToString,
	isBoardFull: isBoardFull,
	flip: flip,
	flipCells: flipCells,
	getCellsToFlip: getCellsToFlip,
	isValidMove: isValidMove,
	isValidMoveAlgebraicNotation: isValidMoveAlgebraicNotation,
	getValidMoves: getValidMoves,
	getLetterCounts: getLetterCounts,
	printScore: printScore,
};