//global selections and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;

//functions

//color generator
function generateHex() {
    //  /the code using chroma js
    const hexColor = chroma.random();
    return hexColor;

    //  /the code using just js
    // const letters = '0123456789ABCDEF';
    // let hash = '#';
    // for (let i = 0; i < 6; i++) {
    //     hash += letters[Math.floor(Math.random() * 16)];
    // }
    // return hash;
}
function randomColors() {
    colorDivs.forEach((div) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        //add the color to the background
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        //check for contrast
        checkTextContrast(randomColor, hexText);
    });
}
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if(luminance > 0.5){
        text.style.color = 'black';
    } else {
        text.style.color = 'white';
    }
}


randomColors();