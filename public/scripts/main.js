
var rhit = rhit || {};

rhit.counter = 0;

rhit.main = function () {
	console.log("Ready");
	const buttons = document.querySelectorAll("#counterButtons button");
	for (const button of buttons) {
		button.onclick = (event) => {
			const dataAmount = parseInt(button.dataset.amount);
			const dataIsMultiplication = button.dataset.isMultiplication === "true";
			// console.log(`Amount: ${typeof(amount)} isMult: ${typeof(isMultiplication)}`);
			rhit.updateCounter(dataAmount, dataIsMultiplication);
		}; 
	}
};

rhit.updateCounter = function (amount, isMultiplication) {
	if (isMultiplication){
		rhit.counter = rhit.counter * amount;
	} else {
		rhit.counter = rhit.counter + amount;
	}
	console.log(rhit.counter);
	document.querySelector("#counterText").innerHTML = `Count = ${rhit.counter}`;
};

rhit.main();
