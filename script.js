var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var halfWidth = windowWidth / 2;
var halfHeight = windowHeight / 2;

const canvas = document.querySelector("#canvas");
canvas.width = windowWidth;
canvas.height = windowHeight;
const ctx = canvas.getContext("2d");
var elements;
const searchBar = document.querySelector("#search");

const elementInfo = document.querySelector(".element-info")
const elementSymbol = document.querySelector(".element-symbol")
const notFound = document.querySelector(".not-found")

function findElement(array,symbol) {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if(element.symbol.toLowerCase() == symbol.toLowerCase()){
            return element;
        }
    }
    return null;
}
async function init() {
    await fetch("./periodic.json")
    .then(text => text.json())
    .then(json => {
        elements = json.elements;
    })
    loadElement()
}
function drawCircle(x,y, radius = 15, color="#00ff00",width = 2,stroke = true, fill = false, fillColor = "#ff0000"){
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, 360)
    if(stroke){
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    if(fill){
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
}

function rotate(theta, x, y){
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const rotatedX = x * cosTheta - y * sinTheta;
    const rotatedY = x * sinTheta - y * cosTheta;
    return {x:rotatedX,y:rotatedY}
}

function distributeElectrons(atomicNumber) {
    const shellLimits = [2, 8, 18, 32, 32, 18, 8];
    let shells = [];
    let remainingElectrons = atomicNumber;

    for (let limit of shellLimits) {
        if (remainingElectrons > limit) {
            shells.push(limit);
            remainingElectrons -= limit;
        } else {
            shells.push(remainingElectrons);
            break;
        }
    }
    return shells;
}

function loadElement(){
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    halfWidth = windowWidth / 2;
    halfHeight = windowHeight / 2;

    canvas.width = windowWidth;
    canvas.height = windowHeight;

    var ringSpacing = 35;
    var ringOffset = 50;
    ctx.clearRect(0,0,windowWidth,windowHeight,"black");
    var element = findElement(elements, searchBar.value)
    elementInfo.children[0].innerHTML = ``
    elementInfo.children[1].innerHTML = ``
    elementInfo.children[2].innerHTML = ``
    elementSymbol.innerHTML = ""
    notFound.style.display = element == null ? "" : "none"
    if(element !== null){
        elementInfo.children[0].innerHTML = `Name: ${element.name}`
        elementInfo.children[1].innerHTML = `Atomic Number: ${element.number}`
        elementInfo.children[2].innerHTML = `Atomic Mass: ${element.atomic_mass}`
        elementSymbol.innerHTML = element.symbol
        let elementColor = "#a0a0a0"
        if(element.appearance !== null){
            let cleanAppearance = element.appearance
            let blockList = [
                ",",
                "lustrous",
                "white",
                "ish",
                "black",
                "colourless",
                "waxy",
                "pale",
                "gas",
                "unknown",
                "probably",
                "luster",
                "metallic",
                "with",
                "tinge",
                "a "
            ]
            blockList.forEach(element =>{
                cleanAppearance = cleanAppearance.replaceAll(element, "")
            })
            cleanAppearance = cleanAppearance.replace("brown","#896129")
            cleanAppearance = cleanAppearance.replace("yellowgreen","#9ACD32")
            cleanAppearance = cleanAppearance.replace("red-orange","#FF4433")
            cleanAppearance = cleanAppearance.replace("silvery","#C0C0C0")
            cleanAppearance = cleanAppearance.replace("metallic","#71797E")
            cleanAppearance = cleanAppearance.replace("gray","#71797E")
            cleanAppearance = cleanAppearance.replace("grey","#71797E")
            cleanAppearance = cleanAppearance.replace("-"," ")
            cleanAppearance = cleanAppearance.replace("y-"," ")
            cleanAppearance = cleanAppearance.trim()
            elementColor = cleanAppearance.split(" ")[0].trim()
        }
        drawCircle(halfWidth,halfHeight,ringOffset,"#3f3f3f",4,false,true,elementColor);
        var shells = distributeElectrons(element.number)
        for (let s = 1; s < shells.length + 1; s++) {
            drawCircle(halfWidth,halfHeight,ringOffset + ringSpacing * s,"#3f3f3f",4);
            for (let i = 0; i < shells[s - 1]; i++) {
                let dotPosition = rotate(i * (Math.PI / shells[s - 1]) * 2, 0,ringOffset + ringSpacing * s);
                drawCircle(dotPosition.x + halfWidth,dotPosition.y + halfHeight,7,"#fff",4,false,true,"#fff");
            }
        }
    }/*
    else{
        console.log("Could not find a match.")
    }*/
}
init()
searchBar.addEventListener("input",e=>{
    loadElement(searchBar.value)
})

window.addEventListener("resize",e=>{
    loadElement(searchBar.value);
})