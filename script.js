// --- Canvas y estrellas ---
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Estrellas fijas
let stars = [];
const numStars = 120;
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    delta: Math.random() * 0.02
  });
}

// Fugaces realistas
let shootingStars = [];

function createShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height/2,
    length: Math.random() * 150 + 50,
    speed: Math.random() * 8 + 5,
    alpha: 1,
    angle: Math.random() * 0.3 + 0.1
  });
}

setInterval(createShootingStar, 3000);

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar estrellas fijas
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
    s.alpha += s.delta;
    if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
  });

  // Dibujar fugaces
  shootingStars.forEach((s, index) => {
    const x2 = s.x - s.length * Math.cos(s.angle);
    const y2 = s.y + s.length * Math.sin(s.angle);
    const gradient = ctx.createLinearGradient(s.x, s.y, x2, y2);
    gradient.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
    gradient.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();

    s.x += s.speed * Math.cos(s.angle);
    s.y += s.speed * Math.sin(s.angle);
    s.alpha -= 0.01;

    if (s.alpha <= 0 || s.x > canvas.width || s.y > canvas.height) shootingStars.splice(index,1);
  });

  requestAnimationFrame(drawStars);
}
drawStars();

// --- Frases ---
const frases = [
  "La gravedad me atrajo hacia ti.",
  "Eres mi constante universal.",
  "En el vasto cosmos, te encontré.",
  "Nuestro amor es una fuerza fundamental.",
  "Eres el bosón de mi Higgs."
];
let indiceFrase = 0;
const mensajeEl = document.getElementById('mensaje');

function mostrarFrase() {
  mensajeEl.style.opacity = 0;
  setTimeout(() => {
    mensajeEl.textContent = frases[indiceFrase];
    mensajeEl.style.opacity = 1;
    indiceFrase = (indiceFrase + 1) % frases.length;
  }, 1000);
}
setInterval(mostrarFrase, 8000);
mostrarFrase();

// --- Contador ---
const destino = new Date("2026-04-04T18:00:00").getTime();
const contadorEl = document.getElementById('contador');

function actualizarContador() {
  const ahora = new Date().getTime();
  const distancia = destino - ahora;
  if (distancia < 0) {
    contadorEl.textContent = "¡Hoy!";
    return;
  }
  const dias = Math.floor(distancia / (1000*60*60*24));
  const horas = Math.floor((distancia % (1000*60*60*24)) / (1000*60*60));
  const minutos = Math.floor((distancia % (1000*60*60)) / (1000*60));
  const segundos = Math.floor((distancia % (1000*60)) / 1000);
  contadorEl.textContent = `${dias} días ${horas}h ${minutos}m ${segundos}s`;
}
setInterval(actualizarContador, 1000);
actualizarContador();

// --- Música ---
const btnMusica = document.getElementById('btnMusica');
btnMusica.addEventListener('click', () => {
  const player = document.getElementById('ytplayer');
  player.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}','*');
  player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}','*');
});
