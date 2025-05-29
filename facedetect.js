let faceapi;
let detections = [];

let video;
let canvas;

let startLine = 0;
let finishLine;

let numSnails = 4;
let snailEnds = [];

let snailImages = [];
let snailNames = ["gary", "turbo", "steve", "escargot"];

let snailSpeeds = [];

let snailMessage = "";
let snailMessageTimer = 0;

let snailFlip = [];
let oneSnailFlip = false;

let snailWrongWay = [];

//let snailRandom = [];
//let snailRandomActive = false;
//let snailRandomIndex = -1;
//let snailRandomTrail = [];
//let snailRandomEndX = -1;

let snailActive = [];



function preload() {
snailImages[0] = loadImage("snails/gary.png");
snailImages[1] = loadImage("snails/turbo.png");
snailImages[2] = loadImage("snails/steve.png");
snailImages[3] = loadImage("snails/escargot.png");
}

let flipMessages = [
  "did a backflip and could't get back up.",
  "attempted a backflip to impress the crowd and failed. (you missed it, of course)",
  "got too excited and fell on its back.",
  "tried to do gymnastics instead of racing."
];

let wrongWayMessages = [
  "panicked and turned around.",
  "thought backwards was faster.",
  "took a wrong turn but is committing to it with confidence.",
  "raged quit and is going home to see its wife and kids."
];

let randomMessages = [
  "got bored and is wandering around.",
  "gave up racing and is exploring other pastures.",
  "forgot it's in a race.",
  "saw a butterfly and is trying to catch it."
];

let winCaptions = [
    "won and you missed the race",
    "won while you were enjoying life",
    "won! but you wouldn't know because you weren't there",
    "wasn't even trying and still won",
    "cheated but won"
];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
  finishLine = width - 60;
  textFont('Inter Tight');

   // Set a slow frame rate.
   frameRate(30);

   for (let i = 0; i < numSnails; i++) {
    snailEnds.push(startLine);
    snailSpeeds.push({
        min: random(0.02, 0.1),
        max: random(0.3, 1.5)
      });
    snailFlip.push(false);
    snailWrongWay.push(false);
    snailActive.push(true);
    };
  
//    snailRandom = {
//      x: random(width),
//      y: random(height),
//      history: [],
  //    angle: random(TWO_PI),
    //  speed: 2
   // };

  

  video = createCapture(VIDEO);// Creat the video
  video.id("video");
  video.size(width, height);
  video.hide(); 


  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result; //Now all the data in this detections
  // console.log(detections);
  //clear();//Draw transparent background
  drawBoxs(detections);//Draw detection box
  drawLandmarks(detections);//// Draw all the face points
 // drawExpressions(detections, 20, 250, 14);//Draw face expression
  faceapi.detect(gotFaces);// Call the function again at here
}

function drawBoxs(detections){
  //if (detections.length > 0) {//If at least 1 face is detected
    //for (f=0; f < detections.length; f++){
      //let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      //stroke(44, 169, 225);
      //strokeWeight(1);
      //noFill();
      //rect(_x, _y, _width, _height);
    //}
  //}
}

function drawLandmarks(detections){
  //if (detections.length > 0) {//If at least 1 face is detected: 
    //for (f=0; f < detections.length; f++){
    //let points = detections[f].landmarks.positions;
      //for (let i = 0; i < points.length; i++) {
        //stroke(44, 169, 225);
        //strokeWeight(3);
        //square(points[i]._x, points[i]._y,2);
      //}
    //}
  //}
}


//code edited and tweaked from https://editor.p5js.org/ratematica/sketches/WytTUH_wa

function drawSnail(x,y,i) {
push();
translate(x,y);

if (snailFlip[i]){
   scale(1, -1);
   image(snailImages[i], - 90,  - 150, 200, 200); 
   scale(1, -1);
   fill(0);
    textAlign(LEFT, CENTER);
    text(snailNames[i],  90,  50);
    
  
 
} else {

if (snailWrongWay[i]){
  scale(-1,1);
  image(snailImages[i], -110, -100, 200, 200);
  scale(-1,1);
  fill(0);
  textAlign(LEFT, CENTER);
  text(snailNames[i], 90, 50);  
}else {

image(snailImages[i], - 90,- 100, 200, 200); 
fill(0);
textAlign(LEFT, CENTER);
text(snailNames[i], 90, 50);  
}
}

pop();
}

function drawSnails() {

    for (let i = 0; i < numSnails; i++) {
      let y = 150 + i * 150; //space between snails

 //GREEN TRAIL
    fill(0, 255, 0); 
    noStroke();
    rect(startLine, y + 20 , snailEnds[i] - startLine, 30); 



    // 🟢 Draw green trail only if snail never went random
    if (snailActive[i]) {
      fill(0, 255, 0);
      noStroke();
      rect(startLine, y + 20, snailEnds[i] - startLine - 15, 30);
    }
    
    if (snailActive[i]) {
      drawSnail(snailEnds[i], y, i);
    }
    }
}

  function moveSnails() { 
    for (let i = 0; i < numSnails; i++) { 
//if (!snailRandomActive) {
  //for (let j = 0; j < numSnails; j++) {
    //if (
      //snailEnds[j] > startLine + 250 && 
 //     !snailFlip[j] && 
   //   !snailWrongWay[j] && 
     // snailActive[j] &&
      //random() < 0.005 
    //) {
    //  snailRandomIndex = j;
    //  snailRandom.x = snailEnds[j];
    //  snailRandom.y = 150 + j * 150;
    //  snailRandom.history = [];
    //  snailRandomActive = true;
    //  snailActive[j] = false;
     // snailRandomEndX = snailEnds[snailRandomIndex];

      //snailRandom.angle = random(-PI / 6, PI / 6);
      //snailRandom.baseAngle = snailRandom.angle;

      //snailMessage = `${snailNames[j]} forgot it's in a race.`;
      //snailMessageTimer = 240;
     // break;
    //}
  //}
//}
     
  
    
        if (!snailFlip[i]) {
      let move = random(snailSpeeds[i].min, snailSpeeds[i].max); //RANDOM SPEED 
    
  //SNAIL WRONG WAY
      if (snailWrongWay[i]){
        snailEnds[i] -= move;
      } else {
        snailEnds[i] +=move;
      

      if (!snailWrongWay.includes(true) && snailEnds[i] > startLine + 300 && random() < 0.001) {
        snailWrongWay[i] = true;

      snailMessage = `${snailNames[i]} ${random(wrongWayMessages)}`;
      snailMessageTimer = 240;
      }
        }

   //SNAIL FLIP
      if (!oneSnailFlip && snailEnds[i] > startLine + 200 && random() < 0.001) {
      snailFlip[i] = true; 
      oneSnailFlip = true;

      snailMessage = `${snailNames[i]} ${random(flipMessages)}`;
      snailMessageTimer = 240;
    

         }  
        }  
    }
  }
  
  
//function updateSnailRandom() {

 //if (!snailRandomActive) {return;//
  
 // if (detections.length === 0){
 // snailRandom.angle += random(-0.03, 0.03);
//snailRandom.angle = constrain(snailRandom.angle, snailRandom.baseAngle - PI / 8, snailRandom.baseAngle + PI / 8);

  //snailRandom.x += cos(snailRandom.angle) * snailRandom.speed;
  //snailRandom.y += sin(snailRandom.angle) * snailRandom.speed;

  //let v = createVector(snailRandom.x, snailRandom.y);

  //snailRandom.history.push(v);
  //}


  //trail
  //noStroke();
  //fill(0, 255, 0);
  //for (let pos of snailRandom.history) {
  //  rect(pos.x - 15, pos.y + 20, 30, 30); 
 // }

  //image(snailImages[snailRandomIndex], snailRandom.x - 90, snailRandom.y - 100, 200, 200);
  //fill(0);
  //textAlign(LEFT, CENTER);
  //text(snailNames[snailRandomIndex], snailRandom.x + 90, snailRandom.y + 50);
//}




function draw(){

    clear(); 

    // Draw the start and finish lines.
    noStroke();
    //fill(0);
    //rect(startLine, 0, 5, height);
    //fill(0, 255, 0);
    //rect(finishLine, 0, 20, height);


//snails go and stop text
    if(detections.length > 0){
      //If at least 1 face is detected
        textSize(16);
        textAlign (LEFT, TOP)
        noStroke();
        fill('red');
        text("nothing to see here...", 20, 20);
      }else{
        //If no faces is detected
        textSize(16);
        textAlign (LEFT, TOP)
        noStroke();
        fill('blue');
        text("SNAILS GO!", 20, 20);
        moveSnails();
      }

      //updateSnailRandom();
      drawSnails();
      drawLeaderboard(); 
      
      checkWinner(); 

    if (snailMessageTimer > 0) {
      textSize(16);
      noStroke();
      fill(0);
      textAlign(CENTER, BOTTOM);
      text(snailMessage, width/2, height -30);
      snailMessageTimer--;
    } 
}

function checkWinner() {
    for (let i = 0; i < numSnails; i++) {         
        if (snailEnds[i] > finishLine) {          
        background(255);
        image(snailImages[i], width/2 - 150, height/2 - 300, 350, 350);
        textSize(32);
        textAlign(CENTER);  
        fill(0);
        noStroke();
        let msg = random(winCaptions); 
        text(`${snailNames[i]} ${msg}`, width/2, height/2);
        noLoop();


        setTimeout(() => {
          location.reload(); 
        },20000);


        }
    }
}

  //https://p5js.org/tutorials/repeating-with-loops/


  function drawLeaderboard() {
    let rankings = snailEnds
      .map((pos, i) => ({ name: snailNames[i], pos }))
      .sort((a, b) => b.pos - a.pos); 
  
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Leaderboard:", width - 200, 20);
  
    for (let i = 0; i < rankings.length; i++) {
      text(`${i + 1}. ${rankings[i].name}`, width - 200, 40 + i * 20);
    }
  }


  // random snail: https://www.youtube.com/watch?v=vqE8DMfOajk