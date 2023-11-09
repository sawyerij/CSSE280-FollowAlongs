const functions = require("firebase-functions/logger");
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

app.get("/getmove/:board", (req, res) => {
    const boardString = req.params.board;

    const openings = getOpenLocations(boardString);

    const moveSelected = openings[Math.floor(Math.random() * openings.length)];
    res.send({"move": moveSelected});
});

function getOpenLocations(boardString) {
    const openLocations = [];
    for (var i = 0; i < boardString.length; i++) {
        if (boardString.charAt(i) == '-') {
        openLocations.push(i)
        }
    }
    return openLocations;
}


exports.api = functions.https.onRequest(app);