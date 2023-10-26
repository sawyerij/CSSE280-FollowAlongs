var counter = 0;

function main(){
    console.log("ready")

    document.querySelector("#decButton").onclick = () => {
        counter -= 1;
        updateView();
    }
    document.querySelector("#incButton").onclick = () => {
        counter += 1;
        updateView();
    }

    document.querySelector("#resButton").onclick = () => {
        counter = 0;
        updateView();
    }

    function updateView(){
        document.querySelector("#counterText").innerHTML = `Count = ${counter}`;
    }

    

}

main();