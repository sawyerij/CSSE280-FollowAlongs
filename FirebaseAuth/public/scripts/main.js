var rhit = rhit || {};

rhit.main = function () {
	console.log("Ready!");

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			const displayName = user.displayName;
			const email = user.email;
			const photoURL = user.photoURL;
			const phoneNumber = user.phoneNumer;
			const isAnonymous = user.isAnonymous;
			const uid = user.uid;	

			console.log("The user is signed in ", uid);
			console.log('displayName :>> ', displayName);
			console.log('email :>> ', email);
			console.log('photoURL :>> ', photoURL);
			console.log('phoneNumber :>> ', phoneNumber);
			console.log('isAnonymous :>> ', isAnonymous);
			console.log('uid :>> ', uid);
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

	// test line

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
	};

	document.querySelector("#anonAuthButton").onclick = (event) => {
		firebase.auth().signInAnonymously().catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.code;
			console.log("Anonymous auth error", errorCode, errorMessage);
		});
	};
	rhit.startFirebaseUI();
};

rhit.startFirebaseUI = function() {
	var uiConfig = {
		signinSuccessUrl: '/',
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		],
	};
	// Initialize the FirebaseUI Widget using Firebase.
	const ui = new firebaseui.auth.AuthUI(firebase.auth());
	// The start method will wait until the DOM is loaded.
	ui.start('#firebaseui-auth-container', uiConfig);
};

rhit.main();
