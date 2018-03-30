let game = {
	cards: [],
	score: 0,
	shuffledCards: [],
	turn: 0,
	init: function() {
		let card = [];
		game.shuffledCards = [];
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
		card = card.concat( card );
		game.cards = card;
		game.shuffledCards = game.shuffleCards( game.cards );
		game.display();
	},
	shuffleCards: function() {
		return shuffle( game.cards );
	},
	timer: 0,
	sec: 0,
	display: function() {
		let deck = game.shuffledCards;
		let ul = document.createElement( 'ul' );
		ul.classList.add( 'deck' );
		ul.setAttribute('id', 'deck');
		for ( let i = 0; i < deck.length; i++ ) {
			let li = document.createElement( 'li' );
			li.classList.add( 'card' );
			let iElement = document.createElement( 'i' );
			iElement.classList.add( deck[ i ].class );
			iElement.classList.add( 'fa' );
			iElement.setAttribute( 'index', 'i' + deck[ i ].index );
			li.appendChild( iElement );
			li.addEventListener( 'click', function( event ) {
				game.click( event.target );
			} );
			ul.appendChild( li );
		}
		let desk = document.getElementById( 'desk' );
		desk.innerHTML = '';
		desk.appendChild( ul );
		let move = document.getElementById( 'move' );
		move.textContent = Math.round( game.moves );
		let modalMove = document.getElementById( 'modal-move' );
		modalMove.textContent = Math.round( game.moves );
		let restart = document.getElementById( 'restart' );
		restart.addEventListener( 'click', function( event ) {
			game.reboot();
			event.preventDefault();
		} );
		clearInterval( game.timer );
		time();
		document.getElementById( 'first-star' ).classList.remove( 'empty' );
		document.getElementById( 'second-star' ).classList.remove( 'empty' );
		document.getElementById( 'third-star' ).classList.remove( 'empty' );
		document.getElementById( 'first-star-modal' ).classList.remove( 'empty' );
		document.getElementById( 'second-star-modal' ).classList.remove( 'empty' );
		document.getElementById( 'third-star-modal' ).classList.remove( 'empty' );
	},
	guessed: 0,
	selectedCards: [],
	selectedIds: [],
	lastCardClicked: '',
	moves: 0,
	click: function( target ) {
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
		game.moves = game.moves + 0.5;
		let move = document.getElementById( 'move' );
		move.textContent = Math.round( game.moves );
		let modalMove = document.getElementById( 'modal-move' );
		modalMove.textContent = Math.round( game.moves );
		if ( game.lastCardClicked != target ) {
			game.flip( target );
			game.selectedCards.push( target );
			game.selectedIds.push( target.childNodes[ 0 ].getAttribute( 'index' ) );
			game.check( target );
		}
		if ( game.lastCardClicked === target && game.selectedCards.length === 0 ) {
			game.flip( target );
			game.selectedCards.push( target );
			game.selectedIds.push( target.childNodes[ 0 ].getAttribute( 'index' ) );
		}
		game.lastCardClicked = target;
	},
	flip: function( target ) {
		target.classList.add( 'open' );
		target.classList.add( 'show' );
		// flip card
	},
	lock: function( target ) {
		target.classList.add( 'match' );
		// flip card
	},
	hide: function( target ) {
		target.classList.remove( 'open' );
		target.classList.remove( 'show' );
		// flip card
	},
	check: function() {
		if ( game.selectedCards.length === 2 ) {
			let firstId = game.selectedIds[ 0 ];
			let secondId = game.selectedIds[ 1 ];
			if ( game.selectedCards[ 0 ] != game.selectedCards[ 1 ] && firstId === secondId ) {
				game.lock( game.selectedCards[ 0 ] );
				game.lock( game.selectedCards[ 1 ] );
				game.guessed++;
				game.selectedCards = [];
				game.selectedIds = [];
				if ( game.guessed >= 8 ) {
					game.win();
				}
			} else {
				setTimeout( function wait() {
					game.hide( game.selectedCards[ 0 ] );
					game.hide( game.selectedCards[ 1 ] );
					game.selectedCards = [];
					game.selectedIds = [];
				}, 300 );
			}
		}
		if ( game.selectedCards.length === 0 ) {
			return 0;
		}
		if ( game.selectedCards.length === 1 ) {
			return 0;
		}
		if ( game.selectedCards.length > 2 ) {
			game.selectedCards = [];
			game.selectedIds = [];
		}
	},
	win: function() {
		let sec = document.getElementById( 'seconds' ).innerHTML;
		let min = document.getElementById( 'minutes' ).innerHTML;
		document.getElementById( 'modal-seconds' ).innerHTML = sec;
		document.getElementById( 'modal-minutes' ).innerHTML = min;
		let modal = document.getElementById( 'modal' );
		modal.classList.remove( 'hide' );
		let container = document.getElementById( 'container' );
		container.classList.add( 'hide' );
		let playAgain = document.getElementById( 'replay' );
		playAgain.addEventListener( 'click', function( event ) {
			event.preventDefault();
			game.reboot();
		} );
	},
	reboot: function() {
		let modal = document.getElementById( 'modal' );
		modal.classList.add( 'hide' );
		let container = document.getElementById( 'container' );
		container.classList.remove( 'hide' );
		game.guessed = 0;
		game.move = 0;
		game.moves = 0;
		game.selectedCards = [];
		game.selectedIds = [];
		game.lastCardClicked = '';
		game.init();
	}
};
// Shuffle function from http://stackoverflow.com/a/2450976
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
// Timer function from http://jsfiddle.net/fc37nckg/
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
game.init();