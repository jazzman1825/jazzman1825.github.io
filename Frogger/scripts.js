      const canvas = document.getElementById("target");
      const context = canvas.getContext("2d");


canvas.width = 540;
canvas.height = 390;

class GameObject {
  constructor(InX, InY, speed, color, objWidth, objHeight) {
    this.x = InX;
    this.y = InY;
    this.speed = speed; 
    this.color = color;
    this.objWidth = objWidth;
    this.objHeight = objHeight;
  }

  update() {this.x = (this.x < - this.objWidth? canvas.width: this.x) - this.speed}

  draw() {
    context.beginPath();
    context.rect(this.x, this.y, this.objWidth, this.objHeight);
    context.fillStyle = this.color;
    context.fill();
  }
}

class Car extends GameObject {
  constructor(InX, InY, speed, color, objwidth, objHeight) {
    super(InX, InY, speed, color, objwidth, objHeight)
  }
}

class Turtle extends GameObject {  
  constructor(InX, InY, speed, color, objwidth, objHeight) {
    super(InX, InY, speed, color, objwidth, objHeight)
  }
}

class Zone extends GameObject {
  constructor(InX, InY, speed, color, objwidth, objHeight) {
    super(InX, InY, speed, color, objwidth, objHeight)
  }
}

class Slot extends GameObject {
  constructor(InX, InY, speed, color, objwidth, objHeight) {
    super(InX, InY, speed, color, objwidth, objHeight)
  }
}

class Player extends GameObject {
  constructor(InX, InY, speed, color, objwidth, objHeight) {
    super(InX, InY, speed, color, objwidth, objHeight)
    window.addEventListener('keydown', function(event){
      switch(event.keyCode) {
        case 37:
          player.moveLeft();
          break;
        case 38:
          player.moveUp();
          break;
        case 39:
          player.moveRight();
          break;
        case 40:
          player.moveDown();
          break;
      }
    });
    this.respawnX = InX;
    this.respawnY = InY;
  }
  
  respawn() {
    this.x = this.respawnX;
    this.y = this.respawnY;
  }

  draw() {
    context.beginPath();
    context.rect(this.x, this.y, 30, 30);
    context.fillStyle = this.color;
    context.fill();
  }
  moveUp() {
    this.y -= 30;
  }
  moveDown() {
    this.y += 30;
  }
  moveLeft() {
    this.x -= 30;
  }
  moveRight() {
    this.x += 30;
  }
  isCollision(object) {
    return ((this.y <= object.y + object.objHeight - 1) && (this.y >= object.y) &&
          (((this.x < object.x  + object.objWidth)) && (this.x > object.x) || 
          ((this.x + 30  > object.x) && (this.x < object.x)))) // Я НЕ ЕБУ КАК ЭТО СДЕЛАТЬ НОРМАЛЬНО СУКА
  }
}

class Gamestate {
  constructor(goalScore, frogLives) {
    this.score = goalScore;
    this.lives = frogLives;
  }

  gameWon() {
    // if (this.score == 5) {
    //   alert("You've won the game!");
    // }
    return(this.score==5);
  }

  gameLose() {
    // if (this.lives == 0) {
    //   alert("You've died");
    // }
    return(this.lives==0);
      
  }

}
const Gameobjects = [];

const player = new Player(270, canvas.height-30, 0, "green", 30, 30);

let State = new Gamestate(0, 3);

Gameobjects.push(new Zone(0, canvas.height - 180, 0, "#6f617a", canvas.width, 150)) // asphalt

for(let i = 0; i < 3; i++) {
  Gameobjects.push(new Zone(0 , 180*i, 0, "#5a03fc", canvas.width, 30)) //Safe zones
}

for(let i = 0; i < 5; i++) {
  Gameobjects.push(new Slot(40 + i * 100, 0, 0, "yellow", 60, 30))
}

for(let i = 0; i < 5; i++) {
  spd = getRandomInt(2)+1;
  Gameobjects.push(new Turtle(canvas.width, canvas.height-240-i*30, spd, "brown", 90, 30))
  Gameobjects.push(new Turtle(canvas.width+330, canvas.height-240-i*30, spd, "brown", 90, 30))
}
for(let i = 0; i < 5; i++) {
  let spd = getRandomInt(2)+2;
  Gameobjects.push(new Car(canvas.width, canvas.height-60-i*30, spd, "red", 30, 30))
  Gameobjects.push(new Car(canvas.width+300, canvas.height-60-i*30, spd, "red", 30, 30))
}

Gameobjects.push(player)

Gameobjects.push(new Car(0, canvas.height-360 , 0, "blue", canvas.width, 150))

function updateScreen() {
  // clear the canvas
  context.clearRect(0,0,canvas.width,canvas.height);

  player.speed = 0; 

  Gameobjects[Gameobjects.length - 1].update();
  Gameobjects[Gameobjects.length - 1].draw();

  for (let i = 0; i < Gameobjects.length; ++i) {
    if (player.isCollision(Gameobjects[i])) {
        switch(Gameobjects[i].constructor.name) {
            
        case "Turtle":
        player.speed = Gameobjects[i].speed;
        i = Gameobjects.length;
      break;
      case "Car":
      player.respawn();
      State.lives --;
      lives.innerHTML = "Lives: " + State.lives;
      if(State.gameLose()) {
        alert("You've died")
        return
      }
      
      break;
      case "Slot":
      player.respawn();
      if (Gameobjects[i].color = "yellow") {
        Gameobjects[i].color = "green"
        State.score ++;
        points.innerHTML = "Score: " + State.score;
        if(State.gameWon()) {
          alert("You've won the game, all the slots are filled")
          return
        }
        
      }
      break;
      }
      }
  }

  for(let i = 0; i < Gameobjects.length - 1; ++i ) {
    Gameobjects[i].update();
    Gameobjects[i].draw();
  }
  
  window.requestAnimationFrame(updateScreen);
}

lives.innerHTML = "Lives: " + State.lives;
points.innerHTML = "Score: " + State.score;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

window.requestAnimationFrame(updateScreen);