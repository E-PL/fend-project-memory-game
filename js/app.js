'use strict';
// store game methods and properties in the game object
const game = {
	// initial unsorted cards
	cards: [],
	// store the shuffled cards
	shuffledCards: [],
	// store the current turn (first card or second card)
	turn: 0,
	// run game
	init: function() {
		// reset the card deck
		let card = [];
		game.shuffledCards = [];
		// define the unsorted starting card list
		card[ 0 ] = {
			class: 'fa-ship',
			index: 0,
		};
		card[ 1 ] = {
			class: 'fa-plane',
			index: 1,
		};
		card[ 2 ] = {
			class: 'fa-moon-o',
			index: 2,
		};
		card[ 3 ] = {
			class: 'fa-sun-o',
			index: 3,
		};
		card[ 4 ] = {
			class: 'fa-rocket',
			index: 4,
		};
		card[ 5 ] = {
			class: 'fa-cloud',
			index: 5,
		};
		card[ 6 ] = {
			class: 'fa-bell',
			index: 6,
		};
		card[ 7 ] = {
			class: 'fa-anchor',
			index: 7,
		};
		// double the card list
		card = card.concat( card );
		game.cards = card;
		// shuffle the doubled card list
		game.shuffledCards = game.shuffleCards( game.cards );
		// display the shuffled card list
		game.display();
	},
	// use the function at the bottom to shuffle the cards
	shuffleCards: function() {
		return shuffle( game.cards );
	},
	// display the shuffled card list
	display: function() {
		const deck = game.shuffledCards;
		// create the ul element and set its class and id
		const ul = document.createElement( 'ul' );
		ul.classList.add( 'deck' );
		ul.setAttribute('id', 'deck');
		// every shuffled card
		for ( let i = 0; i < deck.length; i++ ) {
			// create a li element and set class
			const li = document.createElement( 'li' );
			li.classList.add( 'card' );
			// create an i element and set its class
			const iElement = document.createElement( 'i' );
			iElement.classList.add( deck[ i ].class );
			iElement.classList.add( 'fa' );
			// set an index attribute to track matching cards
			iElement.setAttribute( 'index', 'i' + deck[ i ].index );
			li.appendChild( iElement );
			// set the click event listener on the card
			li.addEventListener( 'click', function( event ) {
				game.click( event.target );
			} );
			ul.appendChild( li );
		}
		// clear the board
		const desk = document.getElementById( 'desk' );
		desk.innerHTML = '';
		// append the created list to the page
		desk.appendChild( ul );
		// show the number of moves on the page and on the modal
		const move = document.getElementById( 'move' );
		move.textContent = Math.round( game.moves );
		const modalMove = document.getElementById( 'modal-move' );
		modalMove.textContent = Math.round( game.moves );
		// set the click event listener on the restart button
		const restart = document.getElementById( 'restart' );
		restart.addEventListener( 'click', function( event ) {
			game.reboot();
			event.preventDefault();
		} );

		// reset the star classes
		document.getElementById( 'first-star' ).classList.remove( 'empty' );
		document.getElementById( 'second-star' ).classList.remove( 'empty' );
		document.getElementById( 'third-star' ).classList.remove( 'empty' );
		document.getElementById( 'first-star-modal' ).classList.remove( 'empty' );
		document.getElementById( 'second-star-modal' ).classList.remove( 'empty' );
		document.getElementById( 'third-star-modal' ).classList.remove( 'empty' );
	},
	// counter for guessed card couples 
	guessed: 0,
	// array of clicked cards
	selectedCards: [],
	// array of card ids
	selectedIds: [],
	// last clicked card
	lastCardClicked: '',
	// game moves
	moves: 0,
	// timer instance
	timer: 0,
	// timer count
	sec: 0,
	// when a card is clicked
	click: function( target ) {
		if (game.moves === 0) {
			// reset the timer
			clearInterval( game.timer );
			// start the timer
			time();
		}
		// decrease stars at 8, 16, 24 moves
		if ( game.moves > 8 ) {
			document.getElementById( 'third-star' ).classList.add( 'empty' );
			document.getElementById( 'third-star-modal' ).classList.add( 'empty' );
		}
		if ( game.moves > 16 ) {
			document.getElementById( 'second-star' ).classList.add( 'empty' );
			document.getElementById( 'second-star-modal' ).classList.add( 'empty' );
		}
		if ( game.moves > 24 ) {
			document.getElementById( 'first-star' ).classList.add( 'empty' );
			document.getElementById( 'first-star-modal' ).classList.add( 'empty' );
		}
		// increase moves counter
		game.moves = game.moves + 0.5;
		// update move counter on page and on the modal
		const move = document.getElementById( 'move' );
		move.textContent = Math.round( game.moves );
		let modalMove = document.getElementById( 'modal-move' );
		modalMove.textContent = Math.round( game.moves );
		// if the user didn't clicked twice on the same card
		if ( game.lastCardClicked != target ) {
			// show the card
			game.flip( target );
			// add it the active cards list
			game.selectedCards.push( target );
			// add its id to the active id list
			game.selectedIds.push( target.childNodes[ 0 ].getAttribute( 'index' ) );
			// check if the card is a match
			game.check( target );
		}
		// if the same card is clicked twice, but it's the first phase of the turn
		if ( game.lastCardClicked === target && game.selectedCards.length === 0 ) {
			// show the card
			game.flip( target );
			// add it the active cards list	
			game.selectedCards.push( target );
			// add its id to the active id list
			game.selectedIds.push( target.childNodes[ 0 ].getAttribute( 'index' ) );
		}
		// decrease the moves counter if the same card is clicked twice in the second turn
		if ( game.lastCardClicked === target && game.selectedCards.length === 1 ) {
			game.moves = game.moves - 0.5;
		}
		// save the last clicked card
		game.lastCardClicked = target;
	},
	// show card
	flip: function( target ) {
		// add open and show classes
		target.classList.add( 'open' );
		target.classList.add( 'show' );
	},
	// keep showing guessed cards
	lock: function( target ) {
		// add match class
		target.classList.add( 'match' );
	},
	// hide cards
	hide: function( target ) {
		// remove open and show classes
		target.classList.remove( 'open' );
		target.classList.remove( 'show' );
	},
	// check if cards match
	check: function() {
		// if it's the second part of the turn and two cards are selected
		if ( game.selectedCards.length === 2 ) {
			const firstId = game.selectedIds[ 0 ];
			const secondId = game.selectedIds[ 1 ];
			// if the card have the same index value but is a different HTML collection it's a match
			if ( game.selectedCards[ 0 ] != game.selectedCards[ 1 ] && firstId === secondId ) {
				// keep showing guessed cards
				game.lock( game.selectedCards[ 0 ] );
				game.lock( game.selectedCards[ 1 ] );
				// increase the guess counter
				game.guessed++;
				// reset the selected card list
				game.selectedCards = [];
				game.selectedIds = [];
				// if the guess count reach eight the user wins
				if ( game.guessed >= 8 ) {
					game.win();
				}
			}
			// if the cards have a different index or are the same card clicked two times
			else {
				// wait 300ms 
				setTimeout( function wait() {
					// hide the cards
					game.hide( game.selectedCards[ 0 ] );
					game.hide( game.selectedCards[ 1 ] );
					// reset the selected cards list
					game.selectedCards = [];
					game.selectedIds = [];
				}, 300 );
			}
		}
		// end the check if no card is selected
		if ( game.selectedCards.length === 0 ) {
			return 0;
		}
		// end the check if only one card is selected
		if ( game.selectedCards.length === 1 ) {
			return 0;
		}
		// reset the selected cards if they are more than two
		if ( game.selectedCards.length > 2 ) {
			game.selectedCards = [];
			game.selectedIds = [];
		}
	},
	// at victory show modal with score
	win: function() {
		// display winning time on the modal
		const sec = document.getElementById( 'seconds' ).innerHTML;
		const min = document.getElementById( 'minutes' ).innerHTML;
		document.getElementById( 'modal-seconds' ).innerHTML = sec;
		document.getElementById( 'modal-minutes' ).innerHTML = min;
		// show the modal
		const modal = document.getElementById( 'modal' );
		modal.classList.remove( 'hide' );
		// hide the main page
		const container = document.getElementById( 'container' );
		container.classList.add( 'hide' );
		// set the click event listener on the play again botton
		const playAgain = document.getElementById( 'replay' );
		playAgain.addEventListener( 'click', function( event ) {
			event.preventDefault();
			game.reboot();
		} );
		// reset the timer
		clearInterval( game.timer );
	},
	// reset game
	reboot: function() {
		// hide the modal
		const modal = document.getElementById( 'modal' );
		modal.classList.add( 'hide' );
		// show the main page
		const container = document.getElementById( 'container' );
		container.classList.remove( 'hide' );
		// reset game properties
		game.guessed = 0;
		game.move = 0;
		game.moves = 0;
		game.selectedCards = [];
		game.selectedIds = [];
		game.lastCardClicked = '';
		// restart game
		game.init();
		// reset the timer
		clearInterval( game.timer );
		document.getElementById( 'seconds' ).innerHTML = '00';
		document.getElementById( 'minutes' ).innerHTML = '00';
	}
};

// functions definitions

// shuffle function from http://stackoverflow.com/a/2450976
function shuffle( array ) {
	let currentIndex = array.length,
		temporaryValue, randomIndex;
	while ( currentIndex !== 0 ) {
		randomIndex = Math.floor( Math.random() * currentIndex );
		currentIndex -= 1;
		temporaryValue = array[ currentIndex ];
		array[ currentIndex ] = array[ randomIndex ];
		array[ randomIndex ] = temporaryValue;
	}
	return array;
}
// timer function from http://jsfiddle.net/fc37nckg/
function time() {
	game.sec = 0;

	function pad( val ) {
		return val > 9 ? val : '0' + val;
	}
	game.timer = setInterval( function() {
		document.getElementById( 'seconds' ).innerHTML = pad( ++game.sec % 60 );
		document.getElementById( 'minutes' ).innerHTML = pad( parseInt( game.sec / 60, 10 ) );
	}, 1000 );
}
// run game
game.init();