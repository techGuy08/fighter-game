const canvas = document.querySelector("#game");
const c = canvas.getContext("2d");

class Sprite {
  constructor({ position, imgSrc, scale, framesMax }) {
    this.position = position;
    this.height = 250;
    this.width = 50;
    this.image = new Image();
    this.image.onload = () => {
      this.isLoaded = true;
    };
    this.image.src = imgSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesCount = 0;
    this.holdFrames = 5;
    this.isLoaded = false;
  }

  draw() {
    if (this.isLoaded) {
      c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x,
        this.position.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      );
    }
  }
  updateFrames() {
    this.framesCount++;
    if (this.framesCount % this.holdFrames === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        if (this.image.src != this.sprites.death.image.src) {
          this.framesCurrent = 0;
        }
      }
    }
  }
  update() {
    this.draw();
    this.updateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    controlsKeys,
    color = "red",
    offset,
    healthBarSelector,
    imgSrc,
    scale,
    framesMax,
    sprites,
  }) {
    super({ position, imgSrc, scale, framesMax });
    let keys = {};
    controlsKeys.forEach(function (value) {
      keys[value] = {
        pressed: false,
      };
    });
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.keys = keys;
    this.color = color;
    this.isGrounded = false;
    this.isAttacking = false;
    this.isAttacked = false;
    this.isTakingHit = false;
    this.hp = 100;
    this.healthBarEl = document.querySelector(healthBarSelector);
    this.speed = 10;
    this.attackBox = {
      position: this.position,
      width: 200,
      height: this.width,
      offset,
    };
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imgSrc;

      this.sprites[sprite].audio = new Audio(this.sprites[sprite].audioSrc);
    }
  }

  update() {
    this.draw();
    this.updateFrames();

    if (this.velocity.y > 0) {
      this.velocity.y += gravity;
    }
    if (this.hp > 0) {
      this.position.y += this.velocity.y;

      this.position.x += this.velocity.x;
    }

    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.height - 200
    ) {
      this.velocity.y = 0;
      this.isGrounded = true;
    } else this.velocity.y += gravity;

    if (this.position.x + this.velocity.x <= -200) {
      this.position.x = -200;
    } else if (this.position.x + this.width >= canvas.width - 300) {
      this.position.x = canvas.width - this.width - 300;
    }
    this.healthBarEl.querySelector(".health-line").style.width = this.hp + "%";
  }
  attack() {
    if (!this.isAttacking && this.hp > 0) {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
        this.isAttacked = false;
      }, 600);
    }
  }
  damageTaken(damage) {
    if (isGameRunning) {
      if (this.hp >= damage) {
        this.hp -= damage;
        this.isTakingHit = true;
        setTimeout(() => {
          this.isTakingHit = false;
        }, 600);
      } else if (this.hp < damage) {
        this.hp = 0;
      }
    }
    if (this.hp == 0) {
      isGameRunning = false;
      decideGameEnd(player, player2, timerId);
    }
  }
  switchSprite(name) {
    if (this.image === this.sprites.run.image && name === "attack1") return;

    if (this.sprites[name]) {
      this.image = this.sprites[name].image;
      this.framesMax = this.sprites[name].framesMax;
    }
  }
}
