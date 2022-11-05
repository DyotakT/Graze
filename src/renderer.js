const GRASS_DIV = document.getElementById("grassland");
const COW_DIV = document.getElementById("cow");
const COW_IMG = document.getElementById("cowImg");

var leftMargin = 0;
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

function move() {
    if(moveRight) leftMargin = leftMargin+1;
    if(moveLeft) leftMargin = leftMargin-1;
    COW_DIV.style.marginLeft=leftMargin+"px";
}

function findLargestPatch() {
    var count = 0;
    for(i=0; i<240; i++) {
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

function findNextBigGrass() { debugger
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
        for(var i=Math.ceil(leftMargin/8);i<240;i++) {
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
    for (var i = 0; i < 240; i++) {  
        randomSelection = Math.floor(Math.random() * 5);
        rememberSelection[i]=randomSelection;
        eatenGrassList[i]=false;
        var tag = document.createElement("img");
        tag.setAttribute("src","../resources/grass"+randomSelection+".png");
        tag.setAttribute("id","grass"+i);
        findLargestPatch();
        // tag.setAttribute("height","20px");
        // tag.setAttribute("width","20px");
        GRASS_DIV.appendChild(tag);
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


function eat(grassIndex) { debugger
    const GRASS_TO_EAT = document.getElementById("grass"+Math.round(grassIndex));
    var tag = document.createElement("img");
    tag.setAttribute("src","../resources/grass4.png");
    GRASS_TO_EAT.setAttribute("src","../resources/grass4.png");
    clearInterval(runningInterval);
    sideToss();
    runningInterval = setInterval(eatAndMove,laterSpeed);
}
var l=0;
function eatAndMove() {
    if(leftMargin>1855 || leftMargin<0) endReached = true;

    // if(leftMargin == (Math.ceil(largestPatchEnd/10)*100)) {debugger
    if(leftMargin == largestPatchEnd*8 && onceDone) {
        // largestPatchEnd = largestPatchEnd+1;
        // stopHere = true;
        // for(var i=0; i<2; i++) {
            if(eatenGrassList[largestPatchEnd]!=true){
                eatenGrassList[largestPatchEnd]=true;
                eat(largestPatchEnd);
                onceDone = false;
                findNextBigGrass();
            }else {
                // largestPatchEnd = largestPatchEnd+1;
            }
            // onceDone = false;
            // setInterval(eat(leftMargin), 1000);
        // }
        // endReached = true;
    } else if(!onceDone){
        findNextBigGrass();
        move();debugger
        if(leftMargin == nextBigGrassPos*8) {
            eat(nextBigGrassPos);
            // findNextBigGrass();
        }
    }

    
        // stopHere = true;
        // eat(l);
        // l+=1;
        // endReached = true;
    

    if(endReached) {
        endReached = false;
        if(moveRight) {
            COW_IMG.style.transform="scaleX(-1)";
            moveLeft = true;
            moveRight = false;
        }
        else if(moveLeft) {
            COW_IMG.style.transform="scaleX(1)";
            moveRight = true;
            moveLeft = false;
        }
    }
    // if(moveRight) leftMargin = leftMargin+1;
    // if(moveLeft) leftMargin = leftMargin-1;
    // COW_DIV.style.marginLeft=leftMargin+"px";
    move();
}