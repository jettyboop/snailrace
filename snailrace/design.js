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

let snailRandom = [];
let snailRandomActive = false;
let snailRandomIndex = -1;
let snailRandomTrail = [];
let snailRandomEndX = -1;

let snailEaten= [];
let oneSnailEaten= false;


let snailActive = [];

let leaderboardY = [];

let isSmiling = false; 

let snailInLoveImages = []; 
let snailInLoveWithUser = -1;
let loveReady = false;
let loveTriggered = false;



let fly = {
  x: 0,
  y: 0,
  angle: 0,
  baseAngle: 0,
  speed: 2,
  history: []
};
let flyNoiseOffset = 0;
let flyActive = false;
let flyImg;

let staringTime = 0;
let raceTime = 0; 
let lastTimerUpdate = 0;

let snailMessages = [];
const maxMessages = 3; 

let messageYPositions = [];


function preload() {
snailImages[0] = loadImage("snails/gary.png");
snailImages[1] = loadImage("snails/turbo.png");
snailImages[2] = loadImage("snails/steve.png");
snailImages[3] = loadImage("snails/escargot.png");
snailInLoveImages[0] = loadImage("snails/garyinlove.png");
snailInLoveImages[1] = loadImage("snails/turboinlove.png");
snailInLoveImages[2] = loadImage("snails/steveinlove.png");
snailInLoveImages[3] = loadImage("snails/escargotinlove.png");
flyImg = loadImage("snails/fly.png");
}



let flipMessages = [
  "did a backflip and could't get back up",
  "attempted a backflip to impress the crowd and failed (you missed it, of course)",
  "got too excited and fell on its back",
  "tried to do gymnastics instead of racing"
];

let eatenMessages = [
  "{EATER} ate {VICTIM}",
  "{EATER} was hungry and saw {VICTIM}",
  "{VICTIM} is gone, {EATER} was hungry",
];

let wrongWayMessages = [
  "panicked and turned around",
  "thought backwards was faster",
  "took a wrong turn but is committing to it with confidence",
  "raged quit and is going home to see its wife and kids"
];

let randomSnailMessages = [
  "got bored and is wandering around",
  "gave up racing and is exploring other pastures",
  "forgot it's in a race",
  "saw a butterfly and is trying to catch it"
];



let winCaptions = [
    "won and you missed the race",
    "won while you were enjoying life",
    "won! but you wouldn't know because you weren't there",
    "wasn't even trying and still won",
    "cheated but won"
];


function setup() {canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
  canvas.style('display', 'block');
  finishLine = width - 60;
  textFont("Helvetica");

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
    snailEaten.push(false);
    };
  
    snailRandom = {
      x: random(width),
      y: random(height),
      history: [],
      angle: random(TWO_PI),
      speed: 1
    };


//animated leaderboard
   for (let i = 0; i < numSnails; i++) {
    leaderboardY.push(40 + i * 20); 
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

let inLoveMessages = [
    "saw someone smiling and fell in love",
    "got shy",
    "fell in love with you",
    "fell in love"
  ];

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result; //Now all the data in this detections
  
    isSmiling = false;
  if (detections.length > 0 && detections[0].expressions) {
  let expressions = detections[0].expressions;
  
  if (expressions.happy > 0.85) { 
    isSmiling = true;
    if (!loveTriggered && random() < 0.1) {
      let validSnails = [];
      for (let i = 0; i < numSnails; i++) {
        if (!snailEaten[i]) validSnails.push(i);
      }
  
      if (validSnails.length > 0) {
        snailInLoveWithUser = random(validSnails);
        loveTriggered = true;
  
       let newMessage = `${snailNames[snailInLoveWithUser]} ${random(inLoveMessages)}`;
        snailMessages.push(newMessage);
        messageYPositions.push(height + 50);
        if (snailMessages.length > maxMessages) snailMessages.shift();
  }

     }
   }

   if (expressions.surprised > 0.8 && !flyActive) {
    flyActive = true;
    fly.x = random(width);
    fly.y = random(height);
    fly.history = [];
    fly.angle = random(TWO_PI);
    fly.baseAngle = fly.angle;
  }
 }
  
  
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

function getSnailY(i) {
  let spacing = height / (numSnails + 1);
  return spacing * (i + 1);
}

function drawSnail(x, y, i) {
  if (snailEaten[i]) return; 
  let img = (i === snailInLoveWithUser) ? snailInLoveImages[i] : snailImages[i]; 
  
  push();
  translate(x, y);

  if (snailFlip[i]) {
    scale(1, -1);
    image(img, -90, -150, 200, 200);
    scale(1, -1);
    fill(0);
    textSize(18);
    textAlign(LEFT, CENTER);
    text(snailNames[i], 90, 50);
  } else if (snailWrongWay[i]) {
    scale(-1, 1);
    image(img, -110, -100, 200, 200);
    scale(-1, 1);
    fill(0);
    textSize(18);
    textAlign(LEFT, CENTER);
    text(snailNames[i], 90, 50);
  } else {
    image(img, -90, -100, 200, 200);
    fill(0);
    textSize(18);
    textAlign(LEFT, CENTER);
    text(snailNames[i], 90, 50);
  }

  pop();
}


function drawSnails() {

  for (let i = 0; i < numSnails; i++) {
  let y = getSnailY(i);

  let trailEnd = (!snailActive[i] && i === snailRandomIndex)
  ? snailRandomEndX
  : snailEnds[i];
      
 //GREEN TRAIL
 fill(0, 255, 0);
 noStroke();
 rect(startLine, y + 20, trailEnd - startLine, 30);

    
 if (snailActive[i] && !snailEaten[i] || i !== snailRandomIndex) {
  drawSnail(snailEnds[i], y, i);
}
    }
}

  function moveSnails() { 
    for (let i = 0; i < numSnails; i++) { 
if (!snailRandomActive) {
  for (let j = 0; j < numSnails; j++) {
    if (
      snailEnds[j] > startLine + 250 && 
      !snailFlip[j] && 
      !snailWrongWay[j] && 
      !snailEaten[i] &&
      snailActive[j] &&
      random() < 0.005 
    ) {
      snailActive[j] = false;
      snailRandomIndex = j;
      snailRandom.x = snailEnds[j];
      snailRandom.y = getSnailY(j);
      snailRandom.history = [];
      snailRandomActive = true;
      snailRandomEndX = snailEnds[snailRandomIndex];

      snailRandom.angle = random(-PI / 6, PI / 6);
      snailRandom.baseAngle = snailRandom.angle;

      let newMessage = `${snailNames[j]} ${random(randomSnailMessages)}`;
      snailMessages.push(newMessage);
      messageYPositions.push(height + 50);
      if (snailMessages.length > maxMessages) snailMessages.shift();
      break;
    }
  }
}
     
  
    
        if (!snailFlip[i] && !snailEaten[i]) {
      let move = random(snailSpeeds[i].min, snailSpeeds[i].max); //RANDOM SPEED 
    
  //SNAIL WRONG WAY
      if (snailWrongWay[i]){
        snailEnds[i] -= move;
      } else {
        snailEnds[i] +=move;
      

      if (!snailWrongWay.includes(true) && snailEnds[i] > startLine + 300 && random() < 0.001 && i !== snailRandomIndex) {
        snailWrongWay[i] = true;

        let newMessage = `${snailNames[i]} ${random(wrongWayMessages)}`;
        snailMessages.push(newMessage);
        messageYPositions.push(height + 50);
        if (snailMessages.length > maxMessages) snailMessages.shift();
      }
        }

//SNAIL FLIP
      if (!oneSnailFlip && snailEnds[i] > startLine + 200 && random() < 0.001  && i !== snailRandomIndex) {
      snailFlip[i] = true; 
      oneSnailFlip = true;

      let newMessage = `${snailNames[i]} ${random(flipMessages)}`;
      snailMessages.push(newMessage);
      messageYPositions.push(height + 50);
      if (snailMessages.length > maxMessages) snailMessages.shift();
      
    }  

//SNAIL EATEN
if (!oneSnailEaten && snailEnds[i] > startLine + 200 && random() < 0.001 && i !== snailRandomIndex) {

  let victim = snailNames[i];

  let allowedEaters = {
    "gary": ["turbo", "steve"],
    "turbo": ["gary", "steve"],
    "steve": ["turbo", "escargot"],
    "escargot": ["steve"]
  };

  let possibleEaters = allowedEaters[victim].filter(name => {
    let index = snailNames.indexOf(name);
    return !snailEaten[index];
  });

  if (possibleEaters.length > 0) {
    let eater = random(possibleEaters);
    let eaterIndex = snailNames.indexOf(eater);

    snailEaten[i] = true;
    oneSnailEaten = true;
    snailActive[i] = false;

let messageTemplate = random(eatenMessages);
let newMessage = messageTemplate
  .replace("{VICTIM}", victim)
  .replace("{EATER}", eater);
snailMessages.push(newMessage);
if (snailMessages.length > maxMessages) snailMessages.shift();
  }
}

        }  
    }
  }
  
  
function updateSnailRandom() {

 if (!snailRandomActive) return;

  if (detections.length === 0){
  snailRandom.angle += random(-0.03, 0.03);
snailRandom.angle = constrain(snailRandom.angle, snailRandom.baseAngle - PI / 8, snailRandom.baseAngle + PI / 8);

  snailRandom.x += cos(snailRandom.angle) * snailRandom.speed;
  snailRandom.y += sin(snailRandom.angle) * snailRandom.speed;

  let v = createVector(snailRandom.x, snailRandom.y);

  snailRandom.history.push(v);
  }


  //trail

  function updateSnailRandomTrailOnly() {
    if (!snailRandomActive) return;

  noStroke();
  fill(0, 255, 0);
  for (let pos of snailRandom.history) {
    rect(pos.x - 15, pos.y + 20, 30, 30); 
  }
}

  image(snailImages[snailRandomIndex], snailRandom.x - 90, snailRandom.y - 100, 200, 200);
  fill(0);
  textAlign(LEFT, CENTER);
text(snailNames[snailRandomIndex], snailRandom.x + 90, snailRandom.y + 50);
}


function updateSnailRandomTrailOnly() {
  if (!snailRandomActive) return;
  noStroke();
  fill(0, 255, 0);
  for (let pos of snailRandom.history) {
    rect(pos.x - 15, pos.y + 20, 30, 30); 
  }
}

function draw(){

    background(255);
//column gutter dividers
    let gutter = 40;
    let colWidth = (width - gutter * 4) / 3;
    
    let leftX = gutter;
    let centerX = leftX + colWidth + gutter;
    let rightX = centerX + colWidth + gutter;

    stroke(200); 
    strokeWeight();
    line(leftX + colWidth + gutter / 2, 0, leftX + colWidth + gutter / 2, height);
    line(centerX + colWidth + gutter / 2, 0, centerX + colWidth + gutter / 2, height);


    updateSnailRandomTrailOnly();

    // Draw the start and finish lines.
    noStroke();
    //fill(0);
    //rect(startLine, 0, 5, height);
    //fill(0, 255, 0);
    //rect(finishLine, 0, 20, height);

    if(detections.length > 0){
      //If at least 1 face is detected
     
      }else{
        //If no faces is detected


    
        moveSnails();
    }
 //   if (isSmiling) {
 //     textSize(16);
 //     fill('black');
 //     noStroke();
 //     textAlign(CENTER, TOP);
 //     text("you smiled", width / 2, 30);
 //   }

    
      drawSnails();
      push();
      if (flyActive) {

        if (detections.length === 0) {
        fly.angle = map(noise(flyNoiseOffset), 0, 1, 0, TWO_PI);
        flyNoiseOffset += 0.02;
        fly.speed = 2;

        fly.x += cos(fly.angle) * fly.speed;
        fly.y += sin(fly.angle) * fly.speed;
      
        fly.x = constrain(fly.x, 0, width);
        fly.y = constrain(fly.y, 0, height);
      
        fly.history.push(createVector(fly.x, fly.y));
        //if (fly.history.length > 200) fly.history.shift();
        }

        // Draw trail
        stroke(0);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let v of fly.history) {
          vertex(v.x, v.y);
        }
        endShape();
      

        push();
        imageMode(CENTER);
        translate(fly.x, fly.y);
        rotate(fly.angle);
        image(flyImg, 0, 0, 30, 30);
      pop();
      }
    
      pop();
      
      updateSnailRandom();
      
      drawLeaderboard(); 
      checkWinner(); 
//timer
if (frameCount - lastTimerUpdate >= 30) { 
    if (detections.length > 0) {
      staringTime++;
    } else {
      raceTime++;
    }
    lastTimerUpdate = frameCount;
  }
//left column 
noStroke();
fill(0);
textSize(16);
textAlign(LEFT, TOP);

text(`STARING TIME: ${formatTime(staringTime)}`, leftX, 20);
text(`RACE TIME: ${formatTime(raceTime)}`, leftX, 40);

if (snailMessages.length > messageYPositions.length) {
    let newCount = snailMessages.length - messageYPositions.length;
    for (let i = 0; i < newCount; i++) {
      messageYPositions.push(height + 50); 
    }
  }

let targetBaseY = height - 60;

for (let i = 0; i < snailMessages.length; i++) {
  let targetY = targetBaseY - (snailMessages.length - 1 - i) * 30;
  messageYPositions[i] = targetY;

  fill(0);
  textAlign(LEFT, BOTTOM);
  textSize(16);
  text(snailMessages[i].toUpperCase(), leftX, messageYPositions[i]);
  
}
if (millis() > 40000) {
    snailMessages = [];
    messageYPositions = [];
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
    let gutter = 40;
    let colWidth = (width - gutter * 4) / 3;
    let rightX = gutter * 3 + colWidth * 2;
    let topY = 30; 

    let rankings = snailEnds
      .map((pos, i) => ({ name: snailNames[i], pos, index: i }))
      .sort((a, b) => b.pos - a.pos);
  
   fill(0);
  noStroke();
  textSize(45);
  textStyle(BOLD);
  text("Leaderboard", rightX, topY);
  
  textSize(16);
  textStyle(NORMAL);
  for (let i = 0; i < rankings.length; i++) {
    let snailIndex = rankings[i].index;
    let targetY = topY + 50 + i * 20;
    leaderboardY[snailIndex] = lerp(leaderboardY[snailIndex], targetY, 0.3);

    let name = rankings[i].name.toUpperCase();
    text(`${nf(i + 1, 2)}. ${name}`, rightX, leaderboardY[snailIndex]);
  }
}
  function formatTime(seconds) {
    let mins = floor(seconds / 60);
    let secs = seconds % 60;
    return nf(mins, 2) + ":" + nf(secs, 2);
  }

  // random snail: https://www.youtube.com/watch?v=vqE8DMfOajk
