var bullets;
var asteroids;
var ship;
var ships = [];
var shipImage, bulletImage;
var MARGIN = 40;
var SOCKET_URL = 'wss://fierce-plains-17880.herokuapp.com/';
var TEAM_NAME  = 'hashtag';
var socket;

function setup() {
createCanvas(windowWidth,windowHeight);
bulletImage = loadImage("assets/missile.png");
shipImage = loadImage("assets/plane.png");

socket = io(SOCKET_URL + TEAM_NAME);
socket.on('plane',function(id){
 createPlane(random(windowWidth),random(windowHeight), id);
});

var id = new Date().getTime();
ship = createPlane(random(windowWidth),random(windowHeight));
socket.emit('plane', ship.id);

socket.on("keyDown", function(key, id){
  handleKeyboard(key, id);
});  

asteroids = new Group();
bullets = new Group();


for(var i = 0; i<8; i++) {
  var ang = random(360);
  var px = width/2 + 1000 * cos(radians(ang));
  var py = height/2+ 1000 * sin(radians(ang));
  createAsteroid(3, px, py);
  }
}

function draw() {
  background(0);
  
  fill(255);
  textAlign(CENTER);
  text("Controls: Arrow Keys + X", width/2, 20);
  
  for(var i=0; i<allSprites.length; i++) {
  var s = allSprites[i];
  if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
  if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
  if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
  if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }
  
  asteroids.overlap(bullets, asteroidHit);
  
  ship.bounce(asteroids);
  
  var key = ""; 

  if(keyDown(LEFT_ARROW))
    key = "left";
  if(keyDown(RIGHT_ARROW))
    key = "right";
  if(keyDown(UP_ARROW))
    key = "up";
  if(keyWentDown("x"))    
    key = "x";

  if(key != "")
    handleKeyboard(key);
  socket.emit("keyDown", key, ship.id);    
  
  
  drawSprites();
  
}

function handleKeyboard(key, id){
  var currentShip;

  if (ship.id == id){
    currentShip = ship;
  }else{
    for(var i=0; i<ships.length; i++){
      if (ships[i].id == id){
        currentShip = ships[i]
        break;  
      }      
    }
  }

  switch(key){
    case "up":
      currentShip.addSpeed(.2, currentShip.rotation);
      break;
    case "left":
      currentShip.rotation -= 4;
      break;
    case "right":
      currentShip.rotation += 4;
      break;
    case "x":
      var bullet = createSprite(currentShip .position.x, currentShip .position.y);
      bullet.addImage(bulletImage);
      bullet.setSpeed(10+currentShip .getSpeed(), currentShip .rotation);
      bullet.life = 50;
      bullet.scale = 0.2;
      bullets.add(bullet);
      break;
  }
}

function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img  = loadImage("assets/asteroid0.png");
  a.addImage(img);
  a.setSpeed(2.5-(type/2), random(360));
  a.rotationSpeed = .5;
  //a.debug = true;
  a.type = type;
  
  if(type == 2)
    a.scale = .6;
  if(type == 1)
    a.scale = .3;
  
  a.mass = 2+a.scale;
  a.setCollider("circle", 0, 0, 50);
  asteroids.add(a);
  return a;
}

function createPlane (x,y, id) {
  var ship;
	ship = createSprite(x,y);
	ship.maxSpeed = 6;
	ship.friction = .98;
	ship.scale = 0.2;
	ship.setCollider("circle", 0,0, 20);
	ship.addImage("normal", shipImage);
  ship.id = id;
	ships.push({
		x: x,
		y: y,
		c: ship
	});

  return ship;
}

function asteroidHit(asteroid, bullet) {
var newType = asteroid.type-1;

if(newType>0) {
  createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  }

bullet.remove();
asteroid.remove();
}