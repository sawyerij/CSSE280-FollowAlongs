
var rhit = rhit || {};


rhit.myClass = class {
	constructor() {
	}
}

rhit.main = function () {
	console.log("Ready");

	// Temp code for read and add
	const ref = firebase.firestore().collection("MovieQuotes");
	ref.onSnapshot((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			console.log(doc.data());
		});
	});

	// ref.add({
	// 	quote: "bruh",
	// 	movie: "bruh the movie",
	// 	lastTouched: firebase.firestore.Timestamp.now(),
	// });

};

rhit.main();
