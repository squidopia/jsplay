(() => {
  // Clear body and set styles
  document.body.innerHTML = '';
  Object.assign(document.body.style, {
    margin: '0',
    background: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    userSelect: 'none',
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const scale = 30;      // size of each cell in px
  const gridSize = 15;   // 15x15 grid

  const canvas = document.createElement('canvas');
  canvas.width = scale * gridSize;
  canvas.height = scale * gridSize;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Back button
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back';
  Object.assign(backBtn.style, {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    padding: '8px 15px',
    fontSize: '16px',
    fontWeight: 'bold',
    background: '#00ff99',
    border: 'none',
    borderRadius: '8px',
    color: '#121212',
    cursor: 'pointer',
    boxShadow: '0 0 10px #00ff99',
    opacity: '0.1',
    transition: 'opacity 0.4s',
    userSelect: 'none',
    zIndex: '9999',
  });
  document.body.appendChild(backBtn);

  backBtn.addEventListener('mouseenter', () => {
    backBtn.style.opacity = '1';
  });
  backBtn.addEventListener('mouseleave', () => {
    backBtn.style.opacity = '0.1';
  });
  backBtn.addEventListener('click', () => {
    window.location.href = '../play.html'; // change as needed
  });

  // Load highscore
  let highscore = parseInt(localStorage.getItem('snakeHighscore')) || 0;

  // Game variables
  let snake = [{ x: 7, y: 7 }];
  let direction = { x: 1, y: 0 }; // start moving right
  let food = null;
  let gameOver = false;
  let score = 0;

  function placeFood() {
    while (true) {
      const newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        food = newFood;
        break;
      }
    }
  }

  placeFood();

  function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, y * scale, scale - 1, scale - 1);
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    drawCell(food.x, food.y, '#00ff99');

    // Draw snake
    snake.forEach((segment, i) => {
      drawCell(segment.x, segment.y, i === 0 ? '#0f0' : '#055005');
    });

    // Draw score & highscore
    ctx.fillStyle = '#0f0';
    ctx.font = '20px monospace';
    ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);
    ctx.fillText(`Highscore: ${highscore}`, 150, canvas.height - 10);

    if (gameOver) {
      ctx.fillStyle = '#f00';
      ctx.font = '40px monospace';
      ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
      ctx.font = '20px monospace';
      ctx.fillText('Press Space or R to Restart', canvas.width / 2 - 130, canvas.height / 2 + 30);
    }
  }

  function update() {
    if (gameOver) return;

    // Calculate new head position
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check collisions with walls
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      gameOver = true;
      saveHighscore();
      return;
    }

    // Check collisions with self
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOver = true;
      saveHighscore();
      return;
    }

    snake.unshift(head);

    // Check if ate food
    if (head.x === food.x && head.y === food.y) {
      score++;
      placeFood();
    } else {
      snake.pop();
    }
  }

  function saveHighscore() {
    if (score > highscore) {
      highscore = score;
      localStorage.setItem('snakeHighscore', highscore);
    }
  }

  // Input handling
  window.addEventListener('keydown', e => {
    if (gameOver && (e.key === ' ' || e.key.toLowerCase() === 'r')) {
      restart();
      return;
    }
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (direction.y !== 1) direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
        if (direction.y !== -1) direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
        if (direction.x !== 1) direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
        if (direction.x !== -1) direction = { x: 1, y: 0 };
        break;
    }
  });

  function restart() {
    snake = [{ x: 7, y: 7 }];
    direction = { x: 1, y: 0 };
    score = 0;
    gameOver = false;
    placeFood();
  }

  function gameLoop() {
    update();
    draw();
  }

  setInterval(gameLoop, 150); // 150ms per frame (~6.6 FPS)

  draw();
})();
