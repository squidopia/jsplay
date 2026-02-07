(() => {
  // Clear body and set styles
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
  });

  // Canvas
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  document.body.appendChild(c);

  function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Load state
  let state = JSON.parse(localStorage.getItem('dvdState')) || {
    x: 100,
    y: 100,
    vx: 5,
    vy: 4,
    color: '#00ff99',
    count: 0,
    corner: 0,
    lastUpdate: Date.now(),
  };

  // Random color
  function randColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

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
    zIndex: '9999',
  });
  document.body.appendChild(backBtn);

  backBtn.onmouseenter = () => backBtn.style.opacity = '1';
  backBtn.onmouseleave = () => backBtn.style.opacity = '0.1';
  backBtn.onclick = () => {
    localStorage.removeItem('dvdState');
    window.location.href = './play.html';
  };

  // DVD size
  const dvdWidth = 80;
  const dvdHeight = 48;

  // ----- SIMULATION STEP (TIME-BASED) -----
  function update() {
    state.x += state.vx;
    state.y += state.vy;

    let bounced = false;

    if (state.x + dvdWidth > c.width) {
      state.x = c.width - dvdWidth;
      state.vx *= -1;
      bounced = true;
    } else if (state.x < 0) {
      state.x = 0;
      state.vx *= -1;
      bounced = true;
    }

    if (state.y > c.height) {
      state.y = c.height;
      state.vy *= -1;
      bounced = true;
    } else if (state.y - dvdHeight < 0) {
      state.y = dvdHeight;
      state.vy *= -1;
      bounced = true;
    }

    if (bounced) {
      state.count++;

      const onLR = (state.x === 0 || state.x === c.width - dvdWidth);
      const onTB = (state.y === dvdHeight || state.y === c.height);

      if (onLR && onTB) {
        state.corner++;
        state.color = randColor();
      }
    }
  }

  // ----- RENDER -----
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = state.color;
    ctx.font = '48px monospace';
    ctx.fillText('DVD', state.x, state.y);

    ctx.fillStyle = '#0f0';
    ctx.font = '20px monospace';
    ctx.fillText('Bounces: ' + state.count, 10, 30);
    ctx.fillText('Corner Bounces: ' + state.corner, 10, 60);
  }

  // ----- MAIN LOOP -----
  function loop() {
    const now = Date.now();
    let elapsed = now - state.lastUpdate;
    state.lastUpdate = now;

    const step = 16; // ~60 updates/sec
    while (elapsed >= step) {
      update();
      elapsed -= step;
    }

    draw();
    localStorage.setItem('dvdState', JSON.stringify(state));
    requestAnimationFrame(loop);
  }

  loop();
})();
