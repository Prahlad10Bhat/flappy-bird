const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const DEGREE = Math.PI / 180;

// Game state
const state = { current: 0, getReady: 0, game: 1, over: 2 };

// Control game
canvas.addEventListener("click", function () {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.over:
      pipes.reset();
      bird.reset();
      score.reset();
      state.current = state.getReady;
      break;
  }
});

// Bird
const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  frame: 0,
  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,
  flap() { this.speed = -this.jump; },
  update() {
    if (state.current === state.getReady) this.y = 150;
    else {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.y + this.h >= canvas.height) {
        this.y = canvas.height - this.h;
        if (state.current === state.game) state.current = state.over;
      }
      if (this.speed >= this.jump) this.rotation = 90 * DEGREE;
      else this.rotation = -25 * DEGREE;
    }
  },
  reset() {
    this.y = 150;
    this.speed = 0;
  },
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  },
};

// Pipes
const pipes = {
  position: [],
  top: { y: 0, h: 150 },
  bottom: { y: 0, h: 150 },
  w: 50,
  gap: 120,
  dx: 2,
  draw() {
    ctx.fillStyle = "#228B22";
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      ctx.fillRect(p.x, p.y, this.w, p.h);
    }
  },
  update() {
    if (state.current !== state.game) return;
    if (frames % 100 === 0) {
      let topH = Math.floor(Math.random() * 200) + 50;
      this.position.push({
        x: canvas.width,
        y: 0,
        h: topH,
        bottomY: topH + this.gap,
        bottomH: canvas.height - (topH + this.gap),
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;

      // collision
      if (
        bird.x + bird.w > p.x &&
        bird.x < p.x + this.w &&
        (bird.y < p.h || bird.y + bird.h > p.bottomY)
      ) {
        state.current = state.over;
      }

      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value++;
      }
    }
  },
  reset() {
    this.position = [];
  },
  drawAll() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      ctx.fillStyle = "#228B22";
      ctx.fillRect(p.x, p.y, this.w, p.h);
      ctx.fillRect(p.x, p.bottomY, this.w, p.bottomH);
    }
  },
};

// Score
const score = {
  value: 0,
  draw() {
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + this.value, 10, 50);
  },
  reset() { this.value = 0; },
};

// Draw function
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  pipes.drawAll();
  bird.draw();
  score.draw();

  if (state.current === state.getReady) {
    ctx.fillStyle = "#000";
    ctx.font = "25px Arial";
    ctx.fillText("Click to Start", 120, canvas.height / 2);
  }
  if (state.current === state.over) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 130, canvas.height / 2);
    ctx.fillText("Click to Restart", 100, canvas.height / 2 + 50);
  }
}

// Update function
function update() {
  bird.update();
  pipes.update();
}

// Loop
function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();
