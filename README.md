<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Traffic Racer - Fuel Image</title>
<style>
body{margin:0;background:#111;color:white;font-family:Arial;text-align:center}
canvas{background:#222;display:block;margin:auto;border:3px solid lime}
</style>
</head>
<body>

<h1>🏎 Traffic Racer - Benzin Görselli</h1>
<p>Ok tuşları ile hareket et. Benzin kutularını topla ⛽</p>
<canvas id="game" width="600" height="400"></canvas>

<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Benzin görseli
const fuelImg = new Image();
fuelImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Fuel_icon.svg/120px-Fuel_icon.svg.png";

let player = {x:280, y:350, width:40, height:60, fuel:100, speed:5};
let keys = {};
let fuelBoxes = [];
let traffic = [];

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Benzin kutuları oluştur
function spawnFuelBox(){
  let x = Math.random() * (canvas.width-30);
  fuelBoxes.push({x:x, y:-50, width:30, height:30});
}
setInterval(spawnFuelBox,3000);

// Trafik arabaları
function spawnTraffic(){
  let x = Math.random() * (canvas.width-40);
  let speed = 2 + Math.random()*3;
  traffic.push({x:x, y:-60, width:40, height:60, speed:speed});
}
setInterval(spawnTraffic,2000);

function update(){
  // Araba hareket
  if(keys["arrowleft"]) player.x -= player.speed;
  if(keys["arrowright"]) player.x += player.speed;
  if(keys["arrowup"]) player.y -= player.speed;
  if(keys["arrowdown"]) player.y += player.speed;
  
  player.x = Math.max(0, Math.min(canvas.width-player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height-player.height, player.y));

  // Benzin azalması
  player.fuel -= 0.05;

  // Benzin kutuları düşer
  for(let box of fuelBoxes){
    box.y += 2;
    if(collide(player, box)){
      player.fuel = Math.min(100, player.fuel+30);
      box.collected = true;
    }
  }
  fuelBoxes = fuelBoxes.filter(box => !box.collected && box.y<canvas.height);

  // Trafik hareketi
  for(let car of traffic){
    car.y += car.speed;
    if(collide(player, car)){
      alert("Çarptın! Game Over!");
      resetGame();
    }
  }
  traffic = traffic.filter(car => car.y<canvas.height+car.height);

  if(player.fuel <= 0){
    alert("Benzin bitti! Game Over!");
    resetGame();
  }
}

function collide(a,b){
  return a.x < b.x+b.width &&
         a.x+a.width > b.x &&
         a.y < b.y+b.height &&
         a.y+a.height > b.y;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Yol çizgileri
  ctx.strokeStyle="white";
  ctx.lineWidth=4;
  for(let i=0;i<canvas.height;i+=40){
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, i+canvas.height%40);
    ctx.lineTo(canvas.width/2, i+20+canvas.height%40);
    ctx.stroke();
  }

  // Player
  ctx.fillStyle="cyan";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Benzin kutuları görsel ile
  for(let box of fuelBoxes){
    ctx.drawImage(fuelImg, box.x, box.y, box.width, box.height);
  }

  // Trafik
  ctx.fillStyle="red";
  for(let car of traffic){
    ctx.fillRect(car.x, car.y, car.width, car.height);
  }

  // Fuel bar
  ctx.fillStyle="white";
  ctx.fillText("Benzin: "+Math.floor(player.fuel),10,20);
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

function resetGame(){
  player = {x:280, y:350, width:40, height:60, fuel:100, speed:5};
  fuelBoxes = [];
  traffic = [];
}
</script>

</body>
</html>
