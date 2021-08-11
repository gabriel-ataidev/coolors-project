//global selections and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
let initialColors;

//event listeners
sliders.forEach(slider => {
    slider.addEventListener('input', hslControls)
});
colorDivs.forEach((div, index) => {
    div.addEventListener('change', () => {
        updateTextUI(index);
    });
});
currentHexes.forEach(hex => {
    hex.addEventListener('click', () => {
        copyToClipboard(hex);
    })
});
popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popup.classList.remove('active');
    popupBox.classList.remove('active');
});

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
    initialColors = [];
    colorDivs.forEach((div) => {
        const hexText = div.children[0];
        const randomColor = generateHex();
        //add it to the array
        initialColors.push(chroma(randomColor).hex());

        //add the color to the background
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        //check for contrast
        checkTextContrast(randomColor, hexText);
        //initial colorize sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });
    //reset inputs
    resetInputs();
}
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if(luminance > 0.5){
        text.style.color = 'black';
    } else {
        text.style.color = 'white';
    }
}
function colorizeSliders(color, hue, brightness, saturation){
    //scale saturation
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    //scale brightness
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);

    //update input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)},${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, Red, Yellow, Green, Cyan, Blue, Magenta)`;
}
function hslControls(e) {
    const index = 
    e.target.getAttribute('data-bright') || 
    e.target.getAttribute('data-sat') ||  
    e.target.getAttribute('data-hue');
    
    let sliders = e.target.parentElement.querySelectorAll("input[type='range']");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = initialColors[index];

    let color = chroma(bgColor)
    .set('hsl.s', saturation.value)
    .set('hsl.l', brightness.value)
    .set('hsl.h', hue.value);

    colorDivs[index].style.backgroundColor = color;
    
    //colorize input sliders
    colorizeSliders(color, hue, brightness, saturation);
}
function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button0');
    textHex.innerText = color.hex();
    //check contrast
    checkTextContrast(color, textHex);
    for(icon of icons) {
        checkTextContrast(color, icon);
    }
}
function resetInputs(){
    const sliders = document.querySelectorAll('.sliders input');
    sliders.forEach(slider => {
        if(slider.name === 'hue'){
            const hueColor = initialColors[slider.getAttribute('data-hue')];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if(slider.name === 'brightness'){
            const brightColor = initialColors[slider.getAttribute('data-bright')];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;
        }
        if(slider.name === 'saturation'){
            const satColor = initialColors[slider.getAttribute('data-sat')];
            const satValue = chroma(satColor).hsl()[2];
            slider.value = Math.floor(satValue * 100) / 100;
        }
       
    })
}
function copyToClipboard(hex) {
    const el = document.createElement('textarea');
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    //pop up animation
    const popupBox = popup.children[0];
    popup.classList.add('active');
    popupBox.classList.add('active');
}
randomColors();
