
console.clear();
process.stdout.write("What is your name? ");

process.stdin.on("data", (data) => {
    console.log(data);
    process.stdout.write("Hello " + data.toString().trim() + "!" + "\n");
    process.exit();
});