<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>DVD Bounce - JSPlay</title>
<style>
  body {
    background: #121212;
    color: #0f0;
    font-family: monospace;
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
    user-select: none;
    position: relative;
  }
  #backBtn {
    position: fixed;
    bottom: 10px;
    left: 10px;
    padding: 8px 15px;
    font-size: 16px;
    font-weight: bold;
    background: #00ff99;
    border: none;
    border-radius: 8px;
    color: #121212;
    cursor: pointer;
    box-shadow: 0 0 10px #00ff99;
    opacity: 0.1;
    transition: opacity 0.4s;
    z-index: 9999;
  }
  #backBtn:hover {
    opacity: 1;
  }
</style>
</head>
<body>

<button id="backBtn">← Back</button>

<script>
(() => {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  document.body.appendChild(c);

  function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Load saved state or defaults
  let state = JSON.parse(localStorage.getItem('dvdState')) || {
    x: 100,
    y: 100,
    vx: 5,
    vy: 4,
    color: '#00ff99',
    count: 0,
    corner: 0,
  };

  function randColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  const dvdWidth = 80;
  const dvdHeight = 48;

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = state.color;
    ctx.font = '48px monospace';
    ctx.fillText('DVD', state.x, state.y);

    // Move
    state.x += state.vx;
    state.y += state.vy;

    let bounced = false;

    // Bounce X
    if (state.x + dvdWidth > c.width) {
      state.x = c.width - dvdWidth;
      state.vx = -state.vx;
      bounced = true;
    } else if (state.x < 0) {
      state.x = 0;
      state.vx = -state.vx;
      bounced = true;
    }

    // Bounce Y
    if (state.y > c.height) {
      state.y = c.height;
      state.vy = -state.vy;
      bounced = true;
    } else if (state.y - dvdHeight < 0) {
      state.y = dvdHeight;
      state.vy = -state.vy;
      bounced = true;
    }

    if (bounced) {
      state.count++;
      // Check corner bounce: touching both X and Y edges simultaneously
      const onLeftOrRight = (state.x === 0 || state.x === c.width - dvdWidth);
      const onTopOrBottom = (state.y === dvdHeight || state.y === c.height);
      if (onLeftOrRight && onTopOrBottom) {
        state.corner++;
        state.color = randColor();
      }
    }

    // Draw counters
    ctx.fillStyle = '#0f0';
    ctx.font = '20px monospace';
    ctx.fillText('Bounces: ' + state.count, 10, 30);
    ctx.fillText('Corner Bounces: ' + state.corner, 10, 60);

    // Save state
    localStorage.setItem('dvdState', JSON.stringify(state));

    requestAnimationFrame(draw);
  }

  draw();

  // Back button logic
  const backBtn = document.getElementById('backBtn');
  backBtn.addEventListener('mouseenter', () => {
    backBtn.style.opacity = '1';
  });
  backBtn.addEventListener('mouseleave', () => {
    backBtn.style.opacity = '0.1';
  });
  backBtn.addEventListener('click', () => {
    localStorage.removeItem('dvdState'); // clear saved state if you want
    window.location.href = './play.html'; // <-- Adjust this path if needed
  });
})();
</script>

</body>
</html>
