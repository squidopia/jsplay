(() => {
  // Clear body and style setup
  document.body.innerHTML = '';
  Object.assign(document.body.style, {
    margin: '0',
    overflow: 'hidden',
    background: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    userSelect: 'none',
    position: 'relative',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  });

  // Back button setup
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
  backBtn.addEventListener('mouseenter', () => backBtn.style.opacity = '1');
  backBtn.addEventListener('mouseleave', () => backBtn.style.opacity = '0.1');
  backBtn.addEventListener('click', () => {
    window.location.href = '../play.html'; // Adjust if needed
  });

  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  // Board settings
  const gridSize = 15;
  const tileSize = 30; // pixels per grid square
  canvas.width = gridSize * tileSize;
  canvas.height = gridSize * tileSize;

  // Game variables
  let snake = [{ x: 7, y: 7 }];
  let direction = { x: 0, y: 0 };
  let food = {};
  let gameOver = false;
  let score = 0;

  // Load highscore from localStorage
  let highscore = parseInt(localStorage.getItem('snakeHighscore')) || 0;

  // Place food at random position not overlapping snake
  function placeFood() {
    while (true) {
      food.x = Math.floor(Math.random() * gridSize);
      food.y = Math.floor(Math.random() * gridSize);
      if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) break;
    }
  }

  placeFood();

  // Draw everything
  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#00ff99';
    snake.forEach(({ x, y }) => {
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });

    // Draw food
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Draw score and highscore
    ctx.fillStyle = '#0f0';
    ctx.font = '20px monospace';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`Highscore: ${highscore}`, 10, 50);
  }

  // Update game state
  function update() {
    if (gameOver) return;

    // Move snake by adding new head
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check collisions with walls
    if (
      head.x < 0 || head.x >= gridSize ||
      head.y < 0 || head.y >= gridSize ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      gameOver = true;
      alert(`Game Over! Your score: ${score}`);
      // Save highscore if beaten
      if (score > highscore) {
        highscore = score;
        localStorage.setItem('snakeHighscore', highscore);
        alert(`New Highscore: ${highscore}!`);
      }
      return;
    }

    snake.unshift(head);

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
      score++;
      placeFood();
    } else {
      snake.pop(); // Remove tail
    }
  }

  // Game loop timing
  let lastTime = 0;
  const speed = 7; // moves per second

  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000;

    if (delta > 1 / speed) {
      update();
      draw();
      lastTime = timestamp;
    }

    if (!gameOver) requestAnimationFrame(gameLoop);
  }

  // Controls (arrow keys / WASD)
  window.addEventListener('keydown', e => {
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

  draw();
  requestAnimationFrame(gameLoop);
})();
