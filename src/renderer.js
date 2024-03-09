const GRASS_DIV = document.getElementById("grassland");
const COW_DIV = document.getElementById("cow");
const COW_IMG = document.getElementById("cowImg");
// var mainScreen = screenElectron.getPrimaryDisplay();
const fs = require('fs');

// var dimensions = mainScreen.size;

// console.log(dimensions.width + "x" + dimensions.height);
// Outputs i.e : 1280x720

// console.log('bounds:', remote.getCurrentWindow().getBounds());


var leftMargin = 1;
var highestCount = 0;
var rememberSelection=[];
var eatenGrassList = [];
var highestCount = 0;
var largestPatchEnd = 0;
var moving = true;
var direction;
var onceDone = true;
var nextBigGrassPos = 0;
// var moveLeft = false;
// var moveRight = false;
var moveRight = true;
var moveLeft = false;
var endReached = false;
var initialSpeed = 1;
var laterSpeed = 10;
var headPosition;
var eatCount = 0;
var screenWidth = 0;
var numberOfGrass = 100;
var rightEdge = 100;
var leftEdge = 0;

var settingsFile = JSON.parse(fs.readFileSync('settings.json','utf8'));
console.log("Screensize:");
console.log(settingsFile.screenWidth);

numberOfGrass = (settingsFile.screenWidth)/8;
console.log("Number of Grass:")
console.log(numberOfGrass);

var newStartEdge = 1;
var newEndEdge = numberOfGrass;

// fetch("../settings.json")
// .then(function (response) {
//     return response.json();
// })
// .then(function(data) {
//     screenWidth = data.screenWidth;
//     numberOfGrass = screenWidth/8;
// })
// console.log(numberOfGrass);
// numberOfGrass = 240;

// var screenWidthFinal = JSON.parse("../settings.json");

function move() {
    ifAllEaten();
    if(moveRight) {
        leftMargin = leftMargin+1;
        moveLeft = false;
        COW_IMG.style.transform="scaleX(1)";
    }
    if(moveLeft) {
        leftMargin = leftMargin-1;
        moveRight = false;
        COW_IMG.style.transform="scaleX(-1)";
    }
    COW_DIV.style.marginLeft=leftMargin+"px";
}

function findLargestEmptyPatch() {
    highestCount = 0;
    var count = 0;
    for(i=0; i<numberOfGrass; i++) {
        if(rememberSelection[i]=='4'){
            count += 1;
        } else {
            if(count>highestCount) {
                largestPatchEnd = i;
                highestCount = count;
            }
            count = 0;
        }
    }
}

function findLargestFullPatch() { debugger
    highestCount = 0;
    var count = 0;
    for(var i=0; i<numberOfGrass; i++) {
        if(rememberSelection[i]!='4'){
            count += 1;
        } else {
            if(count>highestCount) {
                largestPatchEnd = i;
                highestCount = count;
            }
            count = 0;
        }
    }
}

function findNextBigGrass() { 
    if(direction==0) {
        COW_IMG.style.transform="scaleX(-1)";
        for(var i=Math.floor(leftMargin/8);i>0;i--) {
            if(rememberSelection[i]!='4') {
                nextBigGrassPos = i;
                moveRight = false;
                moveLeft = true;
                break;
            }
        }
    } else if(direction==1) {
        COW_IMG.style.transform="scaleX(1)";
        for(var i=Math.ceil(leftMargin/8);i<numberOfGrass;i++) {
            if(rememberSelection[i]!='4') {
                nextBigGrassPos = i;
                moveLeft = false;
                moveRight = true;
                break;
            }
        }
    }
}

function findNextBigGrassAnywhere() {
    if(direction==1) {
        COW_IMG.style.transform="scaleX(-1)";
        for(var i=Math.floor(leftMargin/8);i>0;i--) {
            if(rememberSelection[i]!='4') {
                nextBigGrassPos = i;
                moveRight = false;
                moveLeft = true;
                break;
            }
        }
    } else if(direction==0) {
        COW_IMG.style.transform="scaleX(1)";
        for(var i=Math.ceil(leftMargin/8);i<numberOfGrass;i++) {
            if(rememberSelection[i]!='4') {
                nextBigGrassPos = i;
                moveLeft = false;
                moveRight = true;
                break;
            }
        }
    }
}

function sideToss() {
    direction = Math.round(Math.random()); //1 is right; 0 is left
    if(direction==0) {
        moveRight = false;
        moveLeft = true;
    } else if (direction==1) {
        moveLeft = false;
        moveRight = true;
    }
}

function validityCheck() {
    if(moveRight && headPosition>nextBigGrassPos*8) {
        direction=0;
        moveLeft = true;
        moveRight = false;
    } else if(moveLeft && headPosition<nextBigGrassPos*8) {
        direction=0;
        moveLeft = true;
        moveRight = false;
    }
}

putItems();
// setInterval(eatenGrassEffect,1000);

// function initialStart () {debugger
//     if(moving) {
//         setInterval(eatAndMove, 100)
//         // eatAndMove();
//     }
// }
var runningInterval = setInterval(eatAndMove,initialSpeed);
// initialStart();
// eatAndMove();
// putItems;

function putItems(){
    var randomSelection;
    for (var i = 0; i < numberOfGrass; i++) {  
        randomSelection = Math.floor(Math.random() * 5);
        rememberSelection[i]=randomSelection;
        eatenGrassList[i]=false;
        // if(i<5 || i>235) {
        //     rememberSelection[i] = 0;
        //     eatenGrassList[i] = true;
        // }
        var tag = document.createElement("img");
        tag.setAttribute("src","../resources/grass"+randomSelection+".png");
        tag.setAttribute("id","grass"+i);
        findLargestEmptyPatch();
        // tag.setAttribute("height","20px");
        // tag.setAttribute("width","20px");
        GRASS_DIV.appendChild(tag);
    }
}

function removeItems() {
    for(var i=0;i<numberOfGrass;i++) {
        var element = document.getElementById("grass"+i);
        // element.parentNode.removeChild(element);
        element.remove();
    }
}

// function eatenGrassEffect() {
//     for (var i = 0; i < 192; i++) {
//         const GRASS_TO_EAT = document.getElementById("grass"+i);
//         var tag = document.createElement("img");
//         tag.setAttribute("src","../resources/eatenGrass.png");
//         // tag.setAttribute("height","20px");
//         // tag.setAttribute("width","20px");
//         GRASS_TO_EAT.setAttribute("tag");
//     }
// }


function eat(grassIndex) {
    const GRASS_TO_EAT = document.getElementById("grass"+Math.round(grassIndex));
    var tag = document.createElement("img");
    tag.setAttribute("src","../resources/grass4.png");
    GRASS_TO_EAT.setAttribute("src","../resources/grass4.png");
    rememberSelection[grassIndex]='4';
    // clearInterval(runningInterval);
    eatenGrassList[grassIndex]=true;
    sideToss();
    // runningInterval = setInterval(eatAndMove,laterSpeed);
    eatCount += 1;
}
var l=0;

function eatAndMoved() {
    // if(leftMargin>1850 || leftMargin<1) { debugger
    if(leftMargin>(settingsFile.screenWidth-70) || leftMargin<1) { debugger

        findLargestFullPatch();
    }
    if(leftMargin == nextBigGrassPos*8 && eatenGrassList[nextBigGrassPos]==false) {
        console.log(nextBigGrassPos);
        eat(nextBigGrassPos);
        move();
        // findNextBigGrass();
    } else {
        findNextBigGrass();
        move();
    }
    if(endReached) {
        findLargestFullPatch();
        // endReached = true;
        onceDone = false;
        endReached = false;
        if(moveRight) {
            COW_IMG.style.transform="scaleX(-1)";
            direction=0;
            moveLeft = true;
            moveRight = false;
            move();
            move();
        }
        else if(moveLeft) {
            COW_IMG.style.transform="scaleX(1)";
            direction=1;
            moveRight = true;
            moveLeft = false;
            move();
            move();
        }
    }
}

function updateEdges() { debugger
    for(var i=numberOfGrass-8;i>0;i--) {
        if(rememberSelection[i]!='4') {
            newEndEdge = i;
            break;
        }
        // break;
    }
    rightEdge = newEndEdge*8;
    for(var i=1;i<newEndEdge;i++) {
        if(rememberSelection[i]!='4') {
            newStartEdge = i;
            break;
        }
        // break;
    }
    leftEdge = newStartEdge;
}

function ifAllEaten() {
    var count = 0;
    for(var i=0;i<numberOfGrass;i++) {
        if(rememberSelection[i]=='4') {
            count++;
        }
    }
    if(count>(numberOfGrass*0.95)) {
        removeItems();
        putItems();
    }
}

async function eatAndMove() { debugger
    if(onceDone) move();
    rightEdge = settingsFile.screenWidth-70;
    updateEdges();
    // if(leftMargin>1850 || leftMargin<1) { debugger
    if(leftMargin>rightEdge || leftMargin<leftEdge) {
        endReached = true;
        onceDone = true;
        await findLargestFullPatch();
        // eat(largestPatchEnd);
    }

    if(eatCount > 10) {
        findLargestFullPatch();
        // eat(largestPatchEnd);
        onceDone = true;
        eatCount = 0;
    }

    if(moveLeft) {
        headPosition = leftMargin+45;
        // headPosition = leftMargin;
    } else if(moveRight) {
        headPosition = leftMargin+20;
        // headPosition = leftMargin;
    }


    // if(leftMargin == (Math.ceil(largestPatchEnd/10)*100)) {debugger
    if(leftMargin == largestPatchEnd*8 && onceDone) { 
        // largestPatchEnd = largestPatchEnd+1;
        // stopHere = true;
        // for(var i=0; i<2; i++) {
        if(eatenGrassList[largestPatchEnd]!=true){
            eatenGrassList[largestPatchEnd]=true;
            console.log(largestPatchEnd);
            eat(largestPatchEnd);
            onceDone = false;
            findNextBigGrass();
            move();
        }else {
            // largestPatchEnd = largestPatchEnd+1;
        }
            // onceDone = false;
            // setInterval(eat(leftMargin), 1000);
        // }
        // endReached = true;
    } else if(!onceDone){
        findNextBigGrass();
        // validityCheck();
        // move();debugger
        if(leftMargin == nextBigGrassPos*8 && eatenGrassList[nextBigGrassPos]==false) {
            console.log(nextBigGrassPos);
            eat(nextBigGrassPos);
            move();
            // findNextBigGrass();
        } else {
            // findNextBigGrassAnywhere();
            findNextBigGrass();
            move();
        }
    }

    
        // stopHere = true;
        // eat(l);
        // l+=1;
        // endReached = true;
    

    if(endReached) {
        await findLargestFullPatch();
        // endReached = true;
        onceDone = false;
        endReached = false;
        
        if(moveRight) {
            COW_IMG.style.transform="scaleX(-1)";
            direction=0;
            moveLeft = true;
            moveRight = false;
            move();
            move();
        }
        else if(moveLeft) {
            COW_IMG.style.transform="scaleX(1)";
            direction=1;
            moveRight = true;
            moveLeft = false;
            move();
            move();
        }
    }
    // if(moveRight) leftMargin = leftMargin+1;
    // if(moveLeft) leftMargin = leftMargin-1;
    // COW_DIV.style.marginLeft=leftMargin+"px";
    // move();
}