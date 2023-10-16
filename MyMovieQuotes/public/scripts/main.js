
var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;
rhit.fbSingleQuoteManager = null;
rhit.fbAuthManager = null;

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

			newCard.onclick = (event) => {
				// rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/moviequote.html?id=${mq.id}`;
			}
			newList.appendChild(newCard);
		}

		// Remove the old quoteListContainer
		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		// Put in the new quoteListContainer
		oldList.parentElement.appendChild(newList);
	}

	_createCard(movieQuote) {
		return htmlToElement(
		`<div id="quoteListContainer">
			<div class="card">
			<div class="card-body">
				<h5 class="card-title">${movieQuote.quote}</h5>
				<p class="card-text">${movieQuote.movie}</p>
			</div>
			</div>   
		 </div>`);
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
		this._unsubscribe = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50).onSnapshot((querySnapshot) => {
			console.log("Updated movie quotes");
			this._documentSnapshots = querySnapshot.docs;
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


rhit.DetailPageController = class {
	constructor() {
		document.querySelector("#submitEditQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbSingleQuoteManager.update(quote, movie);
		});

		$("#editQuoteDialog").on("show.bs.modal", (event) => {
			// Pre Animation
			document.querySelector("#inputQuote").value = rhit.fbSingleQuoteManager.Quote;
			document.querySelector("#inputMovie").value = rhit.fbSingleQuoteManager.Movie;
		});

		$("#editQuoteDialog").on("shown.bs.modal", (event) => {
			// Post Animation
			document.querySelector("#inputQuote").focus();
		});

		document.querySelector("#submitDeleteQuote").addEventListener("click", (event) => {
			rhit.fbSingleQuoteManager.delete().then(function() {
				console.log("Document successfully deleted");
				window.location.href = "/";
			}).catch(function (error) {
				console.error("Error removing te document: ", error);
			});
		});

		rhit.fbSingleQuoteManager.beginListening(this.updateView.bind(this));
	}
	updateView() {
		document.querySelector("#cardQuote").innerHTML = rhit.fbSingleQuoteManager.Quote;
		document.querySelector("#cardMovie").innerHTML = rhit.fbSingleQuoteManager.Movie;
	}
}

rhit.FbSingleQuoteManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE).doc(movieQuoteId);
		console.log(`Listening to ${this._ref.path}`)
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data: ", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document");
			}
		});
	};

	stopListening() {
		this.unsubscribe();
	};

	update(quote, movie) {

		this._ref.update({
			[rhit.FB_KEY_QUOTE]: quote,
			[rhit.FB_KEY_MOVIE]: movie,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(() => {
			console.log("Document succesfully updated");
		})
		.catch(function(error) {
			// Document probably doesn't exist
			console.log("Error updating document: ", error);
		})

	};

	delete() {
		return this._ref.delete();
	};

	get Quote() {
		return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
	};

	get Movie() {
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
	};
}


// rhit.storage = rhit.storage || {};
// rhit.storage.MOVIEQUOTE_ID_KEY = "movieQuoteID";
// rhit.storage.getMovieQuoteId = function() {
// 	const mqId = sessionStorage.getItem(rhit.storage.MOVIEQUOTE_ID_KEY);
// 	if (!mqId) {
// 		console.log("No movie quote id in session storage");
// 	}
// 	return mqId;
// };

// rhit.storage.setMovieQuoteId = function(movieQuoteId) {
// 	sessionStorage.setItem(rhit.storage.MOVIEQUOTE_ID_KEY, movieQuoteId);
// }


rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#roseFireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		};
	}
	
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});

	}
	signIn() {
		Rosefire.signIn("5550a927-1072-4dd5-9ada-b63086820957", (err, rfUser) => {
			if (err) {
			  console.log("Rosefire error!", err);
			  return;
			}
			console.log("Rosefire success!", rfUser);

			firebase.auth().signInWithCustomToken(rfUser.token).catch( (error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/invalid-custom-token') {
					alert('The token you provided is not valid.');
				} else {
					console.log("Custom Auth error", errorCode, errorMessage);
				}
			});
			
		  });
	 }

	signOut() {
		firebase.auth().signOut().catch(function (error) {
			console.log("Sign out error");
		});
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}
}

rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("auth changed callback fired. TODO check for redirect and the init page");
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
	});

	if (document.querySelector("#listPage")) {
		console.log("You are on the list page");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager();
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")) {
		console.log("You are on the detail page");
		// const movieQuoteId = rhit.storage.getMovieQuoteId();

		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const movieQuoteId = urlParams.get("id");

		if (!movieQuoteId) {
			window.location.href = "/";
		}
		rhit.fbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page");
		new rhit.LoginPageController();
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
