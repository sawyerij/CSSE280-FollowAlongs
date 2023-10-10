var rhit = rhit || {};

rhit.main = function () {
	console.log("Ready!");

	firebase.auth().onAuthStateChanged((user) => {

		if (user) {
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;	
			console.log("The user is signed in "), uid
		} else {
			console.log("There is no user signed in");
		}

	});
	
	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#signOutButton").onclick = (event) => {
		console.log(`Sign out`);

		firebase.auth().signOut().then(function () {
			console.log("You are now signed out");
		}).catch(function (error) {
			console.log("Sign out error");
		});
	}

	document.querySelector("#createAccountButton").onclick = (event) => {
		console.log(`Create Account for email: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);

		firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.code;
			console.log("Create account error", errorCode, errorMessage);
		});
	}

	document.querySelector("#loginButton").onclick = (event) => {
		console.log(`Login for email: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);

		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.code;
			console.log("Existing account log in error", errorCode, errorMessage);

		});
	}

};

rhit.main();
