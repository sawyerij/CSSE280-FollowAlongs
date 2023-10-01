
var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;

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

	}

	updateList() {

	}
}

rhit.movieQuote = class {
	constructor() {
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}

}

rhit.FbMovieQuotesManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE);
		console.log("Created movie quotes manager")
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
	beginListening(changeListener) {}
	stopListening() {}
	get length() {}
	getMovieQuoteIndex(index) {}
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
