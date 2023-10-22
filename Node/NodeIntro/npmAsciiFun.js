console.log("TODO: Learn to use npm");

// var figlet = require("figlet");

// figlet("CSSE280 using Node.js", (err, data) => {
//     if (err) {
//         console.log("Something went wrong...");
//         console.dir(err);
//         return;
//     }
//     console.log(data);
// });

const imgToAscii = require("ascii-img-canvas-nodejs");

const opts = {};

const asciiImgLocal = imgToAscii("files/node_logo.png", opts);
asciiImgLocal.then( (asciiImgLocal) => {
    console.log(asciiImgLocal);
});