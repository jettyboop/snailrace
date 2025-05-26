let faceapi;
let detections = [];

let video;
let canvas;

let startLine = 30;
let finishLine;

let numSnails = 4;
let snailEnds = [];

let snailImages = [];
let snailNames = ["gary", "turbo", "steve", "escargot"];

let snailSpeeds = [];

function preload() {
snailImages[0] = loadImage("snails/gary.png");
snailImages[1] = loadImage("snails/turbo.png");
snailImages[2] = loadImage("snails/steve.png");
snailImages[3] = loadImage("snails/escargot.png");
}

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

   // Set a slow frame rate.
   frameRate(30);

   for (let i = 0; i < numSnails; i++) {
    snailEnds.push(startLine);
    snailSpeeds.push({
        min: random(0.02, 0.1),
        max: random(0.3, 1.5)
      });

  }



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
//draw snail generalized
image(snailImages[i], x - 90, y - 100, 200, 200); 
fill(0);
textAlign(LEFT, CENTER);
text(snailNames[i], x + 90, y + 50);  
}

function drawSnails() {
    for (let i = 0; i < numSnails; i++) {
      let y = 150 + i * 150; //space between snails

 //GREEN TRAIL
    fill(0, 255, 0); 
    noStroke();
    rect(startLine, y + 20 , snailEnds[i] - startLine, 30); 

      drawSnail(snailEnds[i], y, i);
    }
  }



  function moveSnails() { 
    for (let i = 0; i < numSnails; i++) { 
  

      let move = random(snailSpeeds[i].min, snailSpeeds[i].max);//RANDOM SPEED 
      snailEnds[i] += move; 
    }
  }
  

function draw(){

    clear(); 

    // Draw the start and finish lines.
    noStroke();
    //fill(0);
    //rect(startLine, 0, 5, height);
    //fill(0, 255, 0);
    //rect(finishLine, 0, 20, height);


//snails go and stop text
    if(detections.length > 0){//If at least 1 face is detected
        textFont('Helvetica Neue');
        textSize(16);
        noStroke();
        fill('red');
        text("snails stop", 20, 20);
      }else{//If no faces is detected
        textFont('Helvetica Neue');
        textSize(16);
        noStroke();
        fill('blue');
        text("snails go", 20, 20);
        moveSnails();
      }

 
      drawSnails();
      drawLeaderboard(); 
      
      checkWinner(); 
  
 
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