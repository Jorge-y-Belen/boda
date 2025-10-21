// script.js - versión completa y coherente con el HTML que hemos usado

// Esperar a que el DOM esté listo (por si el script se incluye en <head>)
window.addEventListener('DOMContentLoaded', () => {

  // --- Elementos del DOM ---
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) {
    console.error('No se encontró #starsCanvas. Comprueba el id del canvas en index.html');
    return;
  }
  const ctx = canvas.getContext('2d');

  const mensajeEl = document.getElementById('mensaje');
  const contadorEl = document.getElementById('contador');
  const btnMusica = document.getElementById('btnMusica');
  const ytPlayer = document.getElementById('ytplayer');

  // Ajuste tamaño canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // --- Fondo: gradiente suave ---
  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, '#061021'); // tono superior
    g.addColorStop(1, '#00030b'); // tono inferior
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- Estrellas parpadeantes ---
  const stars = [];
  const NUM_STARS = 400;
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.7, // solo el tercio superior
      size: Math.random() * 1.4 + 0.4,
      alpha: Math.random(),
      d: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
    });
  }

  // --- Shooting stars con estela alineada ---
  const shootingStars = []; // array de objetos
  function spawnShootingStar() {
    // aparición preferentemente en mitad superior del cielo
    const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const y = Math.random() * canvas.height * 0.35 + canvas.height * 0.02;
    const len = Math.random() * 180 + 80;
    const speed = Math.random() * 8 + 6;
    // ángulo entre 210º y 250º (hacia abajo y a la derecha o izquierda según signo)
    const angleDeg = (Math.random() * 40) + 210;
    const angle = angleDeg * Math.PI / 180;
    shootingStars.push({
      x, y, len, speed, angle,
      vx: Math.cos(angle) * speed,
      vy: -(Math.sin(angle) * speed),
      life: 0,
      maxLife: Math.floor((len / speed) * 1.2) + 20,
      alpha: 1
    });
  }

  // Crear disparos aleatorios: normal + ráfagas ocasionales
  setInterval(() => {
    if (Math.random() < 0.9) spawnShootingStar(); // frecuencia base
    // a veces crear una pequeña ráfaga
    if (Math.random() < 0.12) {
      const burst = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < burst; i++) setTimeout(spawnShootingStar, i * 120);
    }
  }, 1800);

  // Cargar imagen de fondo (opcional)
const bgImage = new Image();
bgImage.src = "fondo_boda.jpg"; // o "img/fondo-boda.jpg" si la metes en una carpeta


  // --- Dibujado principal ---
  function draw() {
    // fondo
    //drawBackground();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // imagen de fondo (si está cargada)
    if (bgImage.complete) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }

    // efecto glow en estrellas
    ctx.shadowBlur = 9;
    ctx.shadowColor = "white";

    // estrellas
    for (let s of stars) {
      // parpadeo suave (sin cortes bruscos)
      s.alpha += s.d;
      if (s.alpha <= 0.2 || s.alpha >= 1) s.d *= -1; // invierte dirección del cambio
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size*1.2, 0, Math.PI * 2);
      ctx.fill();

    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // fugaces: se dibujan con gradiente alineado con la velocidad
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const st = shootingStars[i];
      // puntos extremos de la estela: cabeza (st.x, st.y) y cola
      const tailX = st.x - (st.vx / st.speed) * st.len;
      const tailY = st.y - (st.vy / st.speed) * st.len;

      // gradiente alineado con vector movimiento (cabeza->cola)
      const grad = ctx.createLinearGradient(st.x, st.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255,255,255,${st.alpha})`);
      grad.addColorStop(0.6, `rgba(200,220,255,${st.alpha*0.6})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(st.x, st.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // pequeño destello brillante al frente
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${st.alpha})`;
      ctx.arc(st.x, st.y, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // update posición
      st.x += st.vx;
      st.y += st.vy;
      st.life++;
      // atenuación progresiva
      st.alpha = Math.max(0, 1 - (st.life / st.maxLife));

      // eliminar si vida terminada o sale del canvas
      if (st.life > st.maxLife || st.x < -50 || st.y > canvas.height + 50 || st.x > canvas.width + 50) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(draw);
  }

  bgImage.onload = () => {
  draw(); // Solo empieza a dibujar cuando la imagen está cargada
};

  requestAnimationFrame(draw);

  // --- Frases (científico-divertidas) ---
  const frases = [
    "La gravedad me atrajo hacia ti.",
    "Eres mi constante universal.",
    "En el vasto cosmos, te encontré.",
    "Nuestro amor es una fuerza fundamental.",
    "Tu órbita encaja con la mía."
  ];
  let idx = 0;
  function showFrase() {
    if (!mensajeEl) return;
    mensajeEl.style.opacity = 0;
    setTimeout(() => {
      mensajeEl.textContent = frases[idx];
      mensajeEl.style.opacity = 1;
      idx = (idx + 1) % frases.length;
    }, 700);
  }
  showFrase();
  setInterval(showFrase, 7000);

  // --- Contador ---
  const target = new Date("2026-04-04T18:00:00").getTime();
  function updateCounter() {
    if (!contadorEl) return;
    const now = Date.now();
    const d = target - now;
    if (d <= 0) {
      contadorEl.textContent = "¡Hoy!";
      return;
    }
    const dias = Math.floor(d / (1000 * 60 * 60 * 24));
    const horas = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((d % (1000 * 60)) / 1000);
    contadorEl.textContent = `${dias} días ${horas}h ${minutos}m ${segundos}s`;
  }
  updateCounter();
  setInterval(updateCounter, 1000);

  // --- Música: autoplay muted + botón para activar sonido ---
  if (btnMusica && ytPlayer) {
    btnMusica.addEventListener('click', () => {
      // Pedimos al iframe que active el sonido (postMessage)
      try {
        ytPlayer.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        ytPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } catch (e) {
        console.warn('No se pudo mandar postMessage al iframe. Asegúrate de que el iframe tenga id="ytplayer" y la URL correcta de YouTube.');
      }
      // feedback visual
      btnMusica.textContent = 'Música activada';
      btnMusica.disabled = true;
    }, { once: true });
  } else {
    if (!btnMusica) console.warn('#btnMusica no encontrado en DOM');
    if (!ytPlayer) console.warn('#ytplayer (iframe) no encontrado en DOM');
  }

  
}); // DOMContentLoaded
