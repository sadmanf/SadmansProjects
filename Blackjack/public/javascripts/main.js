document.addEventListener('DOMContentLoaded', main);


function main(){
	const submit = document.querySelector('.playBtn');
	submit.addEventListener('click', (evt) => {
		evt.preventDefault();
		const form = document.querySelector('.start');
		form.classList.toggle('visible');
		const values = document.querySelector('#startValues').value.split(',');
		const init = initDeck(values);
		const deck = shuffle(init.length, generate(init));
		const user = [];
		const cpu = [];
		deal(deck, user, cpu);
		printDeck(user);
		printDeck(cpu);
		setup(user, cpu);
		
		const hit = document.querySelector('.hit');
		const stand = document.querySelector('.stand');
		const hidden = document.querySelector('#hidden');
		const cpuScore = document.querySelector('#cpuScore');

		hit.addEventListener('click', (evt) =>{
			const userScore = document.querySelector('#userScore');
			const score = draw(deck, user, '.user');
			userScore.textContent = "User Hand: " + score;
			if (score > 21){
				hit.classList.toggle('visible');
				stand.classList.toggle('visible');
				hidden.classList.toggle('back');
				cpuScore.textContent = "Computer Hand: " + getScore(cpu);
				getResults(getScore(cpu), getScore(user));
			}
		});
		stand.addEventListener('click', (evt) => {
			hit.classList.toggle('visible');
			stand.classList.toggle('visible');
			hidden.classList.toggle('back');
			let score = getScore(cpu);
			while (score < 19){
				score = draw(deck, cpu, '.cpu');
			}cpuScore.textContent = "Computer Hand: " + score;
			getResults(getScore(cpu), getScore(user));
		});	

	});
}

function deal(deck, user, cpu){
	cpu.push(deck[0]);
	deck.shift();
	user.push(deck[0]);
	deck.shift();
	cpu.push(deck[0]);
	deck.shift();
	user.push(deck[0]);
	deck.shift();
}

function initDeck(values){
	if (values[0] === "") return [];
	const suits = ['♦', '♣', '♥', '♠'];
	let deck = [];
	for (const x in values){
		const count = getCount(values[x], deck);
		deck.push({value:values[x], suit: suits[count]});
	}return deck;
}


function generate(deck){
	const faces = ['J', 'Q', 'K'];
	const suits = ['♦', '♣', '♥', '♠'];

	for (let i = 0; i < 52; i++){
		let value = (i % 13) + 1;
		if (value === 1){
			value = 'A';
		}else if (value > 10){
			value = faces[value - 11];
		}value = value.toString();
		const count = getCount(value, deck);
		if (count < 4){
			const card = {value:value, suit:suits[count]}
			if (!hasCard(card, deck)){
				deck.push(card);
			}
		}
	}return deck;
}

function setup(userCards, cpuCards){
	const game = document.querySelector('.game');
	const cpu = document.createElement('div');
	cpu.classList.add('cpu');

	const user = document.createElement('div');
	user.classList.add('user');
	
	const hit = document.createElement('button');
	hit.classList.add('hit');
	hit.appendChild(document.createTextNode("HIT"));

	const stand = document.createElement('button');
	stand.classList.add('stand');
	stand.appendChild(document.createTextNode("STAND"));

	const cpuScore = document.createElement('div');
	cpuScore.id = 'cpuScore';
	cpuScore.classList.add('score');
	cpuScore.appendChild(document.createTextNode("Computer Hand: ???"));

	const userScore = document.createElement('div');
	userScore.id = 'userScore';
	userScore.classList.add('score');
	userScore.appendChild(document.createTextNode("User Hand: " + getScore(userCards)));


	game.appendChild(cpuScore);
	game.appendChild(cpu);
	game.appendChild(hit);
	game.appendChild(stand);
	game.appendChild(userScore);
	game.appendChild(user);

	for(let x = 0; x < userCards.length; x++){
		addCardDiv(userCards[x], '.user');
	}
	for(let y = 0; y < cpuCards.length; y++){
		if (y === 0){
			addCardDiv(cpuCards[y], '.cpu', 'hidden');
		}else{
			addCardDiv(cpuCards[y], '.cpu');
		}
	}
}

function frequency(arr, str){
	let count = 0;
	for (const x in arr){
		if (str === arr[x].value){
			count++;
		}
	}return count;
}

function getScore(hand){
	let score = 0;
	let numA = frequency(hand, 'A');

	let faces = ['J', 'Q', 'K'];
	for (const x in hand){
		let val = hand[x].value;
		if (faces.indexOf(val) > -1){
			val = 10;
		}else if (val !== 'A'){
			val = parseInt(val);
		}else{
			val = 11;
		}
		score += val;
	}
	if (score > 21 && numA > 0){
		for (let a = 0; a < numA; a++){
			if (score > 21){
				score -= 10;
			}
		}
	}return score;
}

function draw(deck, player, playerString){
	// console.log(deck);
	const card = deck[0]
	player.push(card);
	// console.log(card, playerString);
	addCardDiv(card, playerString);
	deck.shift();
	// console.log(getScore(player));
	return getScore(player);
}

function addCardDiv(card, player, hidden){
	const p = document.querySelector(player);

	const c = document.createElement('div');
	// '♦', '♣', '♥', '♠'
	if (hidden === 'hidden'){
		c.classList.add('back');
		c.id = 'hidden';
	}
	if (card.suit === '♥' || card.suit === '♦'){
		c.classList.add('red');
	}else{
		c.classList.add('black');
	}
	const text = document.createTextNode(card.value + card.suit);
	c.appendChild(text);
	p.appendChild(c);
}

function shuffle(start, deck){
	for (let i = start; i < 52; i++){
		const rand = Math.floor(Math.random()* (52-start) + start);
		const temp = deck[rand];
		deck[rand] = deck[i];
		deck[i] = temp;
	}return deck;
}

function getCount(val, arr){
	let counter = 0;
	for (const x in arr){
		if (arr[x].value === val) {
			counter++;
		}
	}return counter;
}

function isEqual(card1, card2){
	return (card1.value === card2.value && card1.suit === card2.suit)
}

function hasCard(card, deck){
	for (const x in deck){
		if (isEqual(card, deck[x])){
			return true;
		}
	}return false;
}

function printDeck(deck){
	for (const x in deck){
		console.log(deck[x]);
	}
}

function getResults(cpuScore, userScore){
	const game = document.querySelector('.game');
	const resultNode = document.createElement('div');
	resultNode.classList.add('score');

	console.log(cpuScore, userScore);
	let result = "It's a tie!";
	if (userScore > 21 || (cpuScore < 22 && cpuScore > userScore)){
		result = "Player Lost :C";
	}else if (cpuScore > 21 || (userScore < 22 && userScore > cpuScore)){
		result = "Congrats! :)";
	}

	resultNode.appendChild(document.createTextNode(result));
	game.appendChild(resultNode);
}