name1 = "Ian Sawyer";

let counter = 0;

inc = () => {counter++};
dec = () => {counter++};

getCounter = () => {return counter;}

module.exports = {
    name1, 
    inc,
    dec,
    getCounter
};