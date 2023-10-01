
var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;

// From stackoverflow
function htmlToElement(html) {
	var template = document.createElement("template");
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor() {
		document.querySelector("#submitAddQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbMovieQuotesManager.add(quote, movie);
		});

		$("#addQuoteDialog").on("show.bs.modal", (event) => {
			// Pre Animation
			document.querySelector("#inputQuote").value = "";
			document.querySelector("#inputMovie").value = "";
		});

		$("#addQuoteDialog").on("shown.bs.modal", (event) => {
			// Post Animation
			document.querySelector("#inputQuote").focus();
		});

		// Start Listening

		rhit.fbMovieQuotesManager.beginListening(this.updateList.bind(this));

	}

	_createCard(movieQuote) {
		return htmlToElement(`<div id="quoteListContainer">
		<div class="card">
		  <div class="card-body">
			<h5 class="card-title">${movieQuote.quote}</h5>
			<p class="card-text">${movieQuote.movie}</p>
		  </div>
		</div>   
	  </div>`);
	}

	updateList() {
		console.log("I need to update the list on the page");
		console.log(`num quotes = ${rhit.fbMovieQuotesManager.length}`);
		console.log("example quote = ", rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(0));

		// Make a new quoteListContainer
		const newList = htmlToElement('<div id="quoteListContainer"></div>');
		// Fill the quoteListContainer with the quote cards using a loop
		for (let i = 0; i < rhit.fbMovieQuotesManager.length; i++) {
			const mq = rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(i);
			const newCard = this._createCard(mq);
			newList.appendChild(newCard);
		}

		// Remove the old quoteListContainer
		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		// Put in the new quoteListContainer
		oldList.parentElement.appendChild(newList);
	}

}

rhit.movieQuote = class {
	constructor(id, quote, movie) {
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}

}

rhit.FbMovieQuotesManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE);
		console.log("Created movie quotes manager");
		this._unsubscribe = null;
	}
	add(quote, movie) {

		// Add a new document with a generated ID.

		this._ref.add({
			[rhit.FB_KEY_QUOTE]: quote,
			[rhit.FB_KEY_MOVIE]: movie,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now()
		})
		.then(function(docref) {
			console.log("Document written with ID: ", docref.id);
		})
		.catch(function (error) {	
			console.log("Error adding document: ", error);
		});

	}
	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((querySnapshot) => {
			console.log("Updated movie quotes");
			this._documentSnapshots = querySnapshot.docs;

			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.data());
			// });

			changeListener();
		});

	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
			return this._documentSnapshots.length;
	}

	getMovieQuoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.movieQuote(docSnapshot.id, docSnapshot.get(rhit.FB_KEY_QUOTE), docSnapshot.get(rhit.FB_KEY_MOVIE));
		return mq;
	}
}



rhit.main = function () {
	console.log("Ready");

	if (document.querySelector("#listPage")) {
		console.log("You are on the list page");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager();
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")) {
		console.log("You are on the detail page");
	}


	// Temp code for read and add
	// const ref = firebase.firestore().collection("MovieQuotes");
	// ref.onSnapshot((querySnapshot) => {
	// 	querySnapshot.forEach((doc) => {
	// 		console.log(doc.data());
	// 	});
	// });

	// ref.add({
	// 	quote: "bruh",
	// 	movie: "bruh the movie",
	// 	lastTouched: firebase.firestore.Timestamp.now(),
	// });

};

rhit.main();
