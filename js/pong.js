(() => {
  // Setup fixed-size canvas container centered vertically and horizontally
  const canvasWidth = 800;
  const canvasHeight = 500;

  // Body styling for centering content and black background
  Object.assign(document.body.style, {
    margin: '0',
    background: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  });

  // Container div to hold canvas and back button
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'relative',
    width: canvasWidth + 'px',
    paddingBottom: '70px', // room for score texts below canvas
  });
  document.body.appendChild(container);

  // Create canvas and add it
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  Object.assign(canvas.style, {
    display: 'block',
    background: '#121212',
    borderRadius: '12px',
    boxShadow: '0 0 20px #00ff9955',
  });
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Back button
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back';
  Object.assign(backBtn.style, {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
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
    window.location.href = 'play.html'; // adjust path if needed
  });

  // Game variables
  const paddleWidth = 120;
  const paddleHeight = 15;
  let paddleX = (canvasWidth - paddleWidth) / 2;
  const paddleY = canvasHeight - paddleHeight - 15;
  const paddleSpeed = 7;

  let ballRadius = 14;
  let ballX = canvasWidth / 2;
  let ballY = canvasHeight / 2;
  let ballSpeedX = 4;
  let ballSpeedY = -4;

  let leftPressed = false;
  let rightPressed = false;
  let aPressed = false;
  let dPressed = false;

  let score = 0;
  let highscore = parseInt(localStorage.getItem('pongHighscore')) || 0;
  let gameOver = false;

  // Draw paddle
  function drawPaddle() {
    ctx.fillStyle = '#00ff99';
    ctx.shadowColor = '#00ff99';
    ctx.shadowBlur = 15;
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.shadowBlur = 0;
  }

  // Draw ball
  function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = '#00ff99';
    ctx.shadowColor = '#00ff99';
    ctx.shadowBlur = 25;
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
  }

  // Draw score and highscore below canvas, centered
  function drawScores() {
    ctx.font = '22px monospace';
    ctx.fillStyle = '#0f0';
    ctx.textAlign = 'center';
    // Clear area below canvas first
    ctx.clearRect(0, canvasHeight, canvasWidth, 70);
    ctx.fillText(`Score: ${score}`, canvasWidth / 2, canvasHeight + 30);
    ctx.fillText(`Highscore: ${highscore}`, canvasWidth / 2, canvasHeight + 60);
  }

  // Draw game over overlay on canvas
  function drawGameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#0f0';
    ctx.font = '42px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvasWidth / 2, canvasHeight / 2 - 20);
    ctx.font = '24px monospace';
    ctx.fillText(`Final Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 30);
    ctx.fillText('Press SPACE or R to Restart', canvasWidth / 2, canvasHeight / 2 + 70);
  }

  // Update paddle position based on keys pressed
  function updatePaddle() {
    if (leftPressed || aPressed) {
      paddleX -= paddleSpeed;
      if (paddleX < 0) paddleX = 0;
    }
    if (rightPressed || dPressed) {
      paddleX += paddleSpeed;
      if (paddleX + paddleWidth > canvasWidth) paddleX = canvasWidth - paddleWidth;
    }
  }

  // Update ball position and handle collisions
  function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off left/right walls
    if (ballX + ballRadius > canvasWidth) {
      ballX = canvasWidth - ballRadius;
      ballSpeedX = -ballSpeedX;
    } else if (ballX - ballRadius < 0) {
      ballX = ballRadius;
      ballSpeedX = -ballSpeedX;
    }

    // Bounce off top wall
    if (ballY - ballRadius < 0) {
      ballY = ballRadius;
      ballSpeedY = -ballSpeedY;
    }

    // Bounce off paddle
    if (
      ballY + ballRadius >= paddleY &&
      ballX > paddleX &&
      ballX < paddleX + paddleWidth &&
      ballSpeedY > 0
    ) {
      ballY = paddleY - ballRadius;
      ballSpeedY = -ballSpeedY;
      score++;
      if (score > highscore) {
        highscore = score;
        localStorage.setItem('pongHighscore', highscore);
      }
    }

    // If ball hits bottom (missed paddle), game over
    if (ballY - ballRadius > canvasHeight) {
      gameOver = true;
    }
  }

  // Restart game
  function restartGame() {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
    ballSpeedX = 4 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = -4;
    paddleX = (canvasWidth - paddleWidth) / 2;
    score = 0;
    gameOver = false;
  }

  // Key event listeners
  window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') leftPressed = true;
    if (e.code === 'ArrowRight') rightPressed = true;
    if (e.code === 'KeyA') aPressed = true;
    if (e.code === 'KeyD') dPressed = true;

    if (gameOver && (e.code === 'Space' || e.code === 'KeyR')) {
      restartGame();
    }
  });

  window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') leftPressed = false;
    if (e.code === 'ArrowRight') rightPressed = false;
    if (e.code === 'KeyA') aPressed = false;
    if (e.code === 'KeyD') dPressed = false;
  });

  // Game loop
  function loop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPaddle();
    drawBall();
    drawScores();

    if (!gameOver) {
      updatePaddle();
      updateBall();
    } else {
      drawGameOver();
    }
    requestAnimationFrame(loop);
  }

  restartGame();
  loop();
})();
