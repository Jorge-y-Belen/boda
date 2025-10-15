// --- Configuración del canvas de estrellas ---
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const numStars = 150;

// Crear estrellas
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    alpha: Math.random(),
    delta: Math.random() * 0.02
  });
}

// Dibujar estrellas
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
    s.alpha += s.delta;
    if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// --- Frases científicas/divertidas ---
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
  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia % (1000*60*60*24)) / (1000*60*60));
  const minutos = Math.floor((distancia % (1000*60*60)) / (1000*60));
  const segundos = Math.floor((distancia % (1000*60)) / 1000);
  contadorEl.textContent = `${dias} días ${horas}h ${minutos}m ${segundos}s`;
}
setInterval(actualizarContador, 1000);
actualizarContador();
