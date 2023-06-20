canvas.width = 1024;
canvas.height = 576;

const gravity = 0.16;
let isGameRunning = true;

const player = new Fighter({
  position: {
    x: 0,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  controlsKeys: ["a", "s", "d", "w"],
  offset: {
    x: 0,
    y: 0,
  },
  healthBarSelector: ".player1 .health-bar",
  imgSrc: "./img/Akai/Idle.png",
  scale: 4,
  framesMax: 10,
  sprites: {
    idle: {
      imgSrc: "./img/Akai/Idle.png",
      framesMax: 10,
    },
    run: {
      imgSrc: "./img/Akai/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/Akai/Going-Up.png",
      framesMax: 3,
    },
    fall: {
      imgSrc: "./img/Akai/Going-Down.png",
      framesMax: 3,
    },
    attack1: {
      imgSrc: "./img/Akai/Attack1.png",
      framesMax: 7,
      audioSrc: "./img/attack.wav",
    },
    death: {
      imgSrc: "./img/Akai/Death.png",
      framesMax: 11,
    },
    hit: {
      imgSrc: "./img/Akai/Take-Hit.png",
      framesMax: 3,
    },
  },
});

const player2 = new Fighter({
  position: {
    x: canvas.width - 500,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  controlsKeys: ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"],
  offset: {
    x: 145,
    y: 0,
  },
  healthBarSelector: ".player2 .health-bar",
  imgSrc: "./img/Hanzo/Idle.png",
  scale: 4,
  framesMax: 11,
  sprites: {
    idle: {
      imgSrc: "./img/Hanzo/Idle.png",
      framesMax: 11,
    },
    run: {
      imgSrc: "./img/Hanzo/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/Hanzo/Jump.png",
      framesMax: 4,
    },
    fall: {
      imgSrc: "./img/Hanzo/Fall.png",
      framesMax: 4,
    },
    attack1: {
      imgSrc: "./img/Hanzo/Attack.png",
      framesMax: 6,
    },
    death: {
      imgSrc: "./img/Hanzo/Death.png",
      framesMax: 9,
    },
    hit: {
      imgSrc: "./img/Hanzo/Take-Hit.png",
      framesMax: 4,
    },
  },
});

function update() {
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (player.keys.w.pressed && player.isGrounded) {
    player.velocity.y = -10;
    player.isGrounded = false;
  }
  if (player2.keys["ArrowUp"].pressed && player2.isGrounded) {
    player2.velocity.y = -10;
    player2.isGrounded = false;
  }

  if (player.isGrounded && !player.isTakingHit) {
    player.switchSprite("idle");
  } else if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (player.keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -player.speed;
    if (player.isGrounded) player.switchSprite("run");
  } else if (player.keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = player.speed;
    if (player.isGrounded) player.switchSprite("run");
  } else {
    player.velocity.x = 0;
  }

  if (player.isTakingHit) {
    player.velocity.x = -2;
  }
  if (player.isAttacking) {
    player.switchSprite("attack1");
  }
  if (player.isTakingHit) {
    player.switchSprite("hit");
  }
  if (player.hp == 0 && player.image !== player.sprites.death.image) {
    player.switchSprite("death");
  }

  if (player2.isGrounded && !player2.isTakingHit) {
    player2.switchSprite("idle");
  } else if (player2.velocity.y < 0) {
    player2.switchSprite("jump");
  } else if (player2.velocity.y > 0) {
    player2.switchSprite("fall");
  }
  if (player2.keys["ArrowLeft"].pressed && player2.lastKey == "ArrowLeft") {
    player2.velocity.x = -player2.speed;
    if (player2.isGrounded) player2.switchSprite("run");
  } else if (
    player2.keys["ArrowRight"].pressed &&
    player2.lastKey == "ArrowRight"
  ) {
    player2.velocity.x = player2.speed;
    if (player2.isGrounded) player2.switchSprite("run");
  } else {
    player2.velocity.x = 0;
  }

  if (player2.isAttacking) {
    player2.switchSprite("attack1");
  }
  if (player2.isTakingHit) {
    player2.switchSprite("hit");
  }
  if (player2.hp == 0 && player2.image !== player2.sprites.death.image) {
    player2.switchSprite("death");
  }

  player.update();
  player2.update();

  if (
    collisionDetect(player, player2) &&
    player.isAttacking &&
    !player2.isTakingHit &&
    isGameRunning
  ) {
    let attackDamage = Math.floor(Math.random() * 20) + 1;
    // player.isAttacked = true;
    player2.damageTaken(attackDamage);
    player2.isTakingHit = true;
    console.log("player1 attacked");
  }
  if (
    collisionDetect(player2, player) &&
    player2.isAttacking &&
    !player.isTakingHit &&
    isGameRunning
  ) {
    let attackDamage = Math.floor(Math.random() * 20) + 1;
    player.damageTaken(attackDamage);
    player.isTakingHit = true;
    console.log("player2 attacked");
  }
}
function collisionDetect(rect1, rect2) {
  let x =
    (rect1.position.x + rect1.attackBox.width - rect1.attackBox.offset.x >=
      rect2.position.x &&
      rect1.position.x + rect1.attackBox.width - rect1.attackBox.offset.x <=
        rect2.position.x + rect2.width) ||
    (rect1.position.x - rect1.attackBox.offset.x <= rect2.position.x &&
      rect1.position.x + rect1.attackBox.width - rect1.attackBox.offset.x >=
        rect2.position.x + rect2.width) ||
    (rect1.position.x - rect1.attackBox.offset.x >= rect2.position.x &&
      rect1.position.x - rect1.attackBox.offset.x <=
        rect2.position.x + rect2.width);
  let y =
    (rect1.attackBox.position.y >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height) ||
    (rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y + rect1.attackBox.height <=
        rect2.position.y + rect2.height);
  return x && y;
}
function animate() {
  window.requestAnimationFrame(animate);
  update();
}

animate();

let timer = 60;
let timerId;
function runTimer() {
  const timerEl = document.querySelector(".timerbox");
  if (timer > 0) {
    timerId = setTimeout(runTimer, 1000);
    timer--;
    if (timer < 10) {
      timerEl.innerHTML = "0";
    } else {
      timerEl.innerHTML = "";
    }
    timerEl.innerHTML += timer;
  } else {
    decideGameEnd(player, player2, timerId);
  }
}
runTimer();

function decideGameEnd(player, player2, timerId) {
  const gameOverEl = document.querySelector(".game-over");
  const gameResultEl = gameOverEl.querySelector(".game-result");
  const winnerNameEl = gameOverEl.querySelector(".game-winner");
  let result = "Winner!";
  if (player.hp > player2.hp) {
    winnerNameEl.innerHTML = "Player 1";
    player2.isTakingHit = false;
  } else if (player2.hp > player.hp) {
    winnerNameEl.innerHTML = "Player 2";
    player.isTakingHit = false;
  } else {
    result = "Draw!";
    winnerNameEl.innerHTML = "";
  }
  gameResultEl.innerHTML = result;
  gameOverEl.classList.add("active");
  isGameRunning = false;
  clearTimeout(timerId);
}

const bgAudio = new Audio("./img/bg.mp3");
bgAudio.loop = true;
bgAudio.volume = 0.5;
bgAudio.play();

window.addEventListener("keydown", function (e) {
  bgAudio.play();
  switch (e.key) {
    case "a":
    case "w":
    case "d":
      player.keys[e.key].pressed = true;
      if (e.key == "a" || e.key == "d") player.lastKey = e.key;
      break;
    case "s":
      player.attack();
      break;
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
      player2.keys[e.key].pressed = true;
      if (e.key == "ArrowLeft" || e.key == "ArrowRight")
        player2.lastKey = e.key;
      break;
    case "ArrowDown":
      player2.attack();
      break;
  }
});

window.addEventListener("keyup", function (e) {
  switch (e.key) {
    case "a":
    case "s":
    case "d":
    case "w":
      player.keys[e.key].pressed = false;
      break;
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowDown":
    case "ArrowUp":
      player2.keys[e.key].pressed = false;
      break;
  }
});
