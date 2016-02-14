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
socket.on('plane',createPlane(random(windowWidth),random(windowHeight)));


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
  
  if(keyDown(LEFT_ARROW))
    ship.rotation -= 4;
  if(keyDown(RIGHT_ARROW))
    ship.rotation += 4;
  if(keyDown(UP_ARROW))
    {
    ship.addSpeed(.2, ship.rotation);
    }
    
  if(keyWentDown("x"))
    {
    var bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
    bullet.life = 30;
    bullets.add(bullet);
    }
  
  drawSprites();
  
}

function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img  = loadImage("assets/asteroid"+floor(random(0,3))+".png");
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

function createPlane (x,y) {
	ship = createSprite(x,y);
	ship.maxSpeed = 6;
	ship.friction = .98;
	ship.scale = 0.2;
	ship.setCollider("circle", 0,0, 20);
	ship.addImage("normal", shipImage);
	ships.push({
		x: x,
		y: y,
		c: ship
	});
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