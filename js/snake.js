(() => {
  // Clear and style body
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
  });

  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  // Grid size
  const scale = 20;
  const rows = Math.floor(canvas.height / scale);
  const cols = Math.floor(canvas.width / scale);

  // Snake properties
  let snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
  let velocity = { x: 0, y: 0 };
  let food = { x: 0, y: 0 };

  let score = 0;
  let highscore = parseInt(localStorage.getItem('snakeHighscore') || '0', 10);

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
    window.location.href = '../play.html'; // Adjust if needed
  });

  // Place food randomly
  function placeFood() {
    food.x = Math.floor(Math.random() * cols);
    food.y = Math.floor(Math.random() * rows);
    // Make sure food isn't on snake
    if (snake.some(seg => seg.x === food.x && seg.y === food.y)) {
      placeFood();
    }
  }

  placeFood();

  // Draw everything
  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = '#00ff99';
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale);

    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach((segment, i) => {
      ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
      if (i === 0) { // Head - a brighter green
        ctx.fillStyle = '#22ff22';
        ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
        ctx.fillStyle = '#0f0'; // reset for body
      }
    });

    // Draw scores
    ctx.fillStyle = '#0f0';
    ctx.font = '20px monospace';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`Highscore: ${highscore}`, 10, 50);
  }

  // Update snake position and game logic
  function update() {
    if (velocity.x === 0 && velocity.y === 0) {
      draw();
      requestAnimationFrame(update);
      return; // wait until player moves
    }

    // Move snake's body
    let head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Wrap around screen edges
    if (head.x < 0) head.x = cols - 1;
    else if (head.x >= cols) head.x = 0;
    if (head.y < 0) head.y = rows - 1;
    else if (head.y >= rows) head.y = 0;

    // Check collision with self -> reset game
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      if (score > highscore) {
        highscore = score;
        localStorage.setItem('snakeHighscore', highscore);
      }
      // Reset
      snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
      velocity = { x: 0, y: 0 };
      score = 0;
      placeFood();
      draw();
      requestAnimationFrame(update);
      return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      score++;
      placeFood();
    } else {
      snake.pop();
    }

    draw();
    requestAnimationFrame(update);
  }

  // Handle keyboard input
  window.addEventListener('keydown', e => {
    const key = e.key;
    if (key === 'ArrowUp' && velocity.y === 0) {
      velocity = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' && velocity.y === 0) {
      velocity = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' && velocity.x === 0) {
      velocity = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' && velocity.x === 0) {
      velocity = { x: 1, y: 0 };
    }
  });

  // Resize canvas on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  draw();
  update();
})();

