var rhit = rhit || {};

rhit.main = function () {
	console.log("Ready!");
	
	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#signOutButton").onclick = (event) => {
		console.log(`Sign out`);
	}

	document.querySelector("#createAccountButton").onclick = (event) => {
		console.log(`Create Account for email: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);
	}

	document.querySelector("#loginButton").onclick = (event) => {
		console.log(`Login for email: ${inputEmailEl.value} password: ${inputPasswordEl.value}`);
	}

};

rhit.main();
