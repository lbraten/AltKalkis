
// 🔄 Dato og tid (digital)
function updateDateTime() {
  const now = new Date();
  const el = document.getElementById("currentDateTime");
  if (el) el.innerText = now.toLocaleString("nb-NO");
}

// 🎯 Analog klokke (canvas)
function drawAnalogClock() {
  const canvas = document.getElementById("analogClock");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Skarp på høy-DPI skjermer (retina)
  const dpr = window.devicePixelRatio || 1;
  const logicalSize = Math.min(canvas.width, canvas.height);
  const size = logicalSize; // attributtstørrelse (px) fra HTML
  if (canvas._scaled !== true) {
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas._scaled = true;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const radius = size / 2;
  ctx.clearRect(0, 0, size, size);

  // Midtpunkt
  ctx.translate(radius, radius);

  // Bakgrunn / klokkeramme
  ctx.beginPath();
  ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";         // lys bakgrunn (tilpass til tema)
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#333333";       // ramme
  ctx.stroke();

  // Tallmarkører og streker
  ctx.save();
  ctx.strokeStyle = "#333333";
  ctx.fillStyle = "#333333";
  ctx.lineCap = "round";

  // Minuttstreker
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30;
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -(radius - 10));
    ctx.lineTo(0, -(radius - (i % 5 === 0 ? 18 : 14)));
    ctx.lineWidth = i % 5 === 0 ? 2 : 1;
    ctx.stroke();
    ctx.rotate(-angle);
  }

  // Tall (1–12)
  ctx.font = `${Math.floor(radius * 0.13)}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let n = 1; n <= 12; n++) {
    const angle = (n * Math.PI) / 6;
    const tx = Math.sin(angle) * (radius - 32);
    const ty = -Math.cos(angle) * (radius - 32);
    ctx.fillText(String(n), tx, ty);
  }
  ctx.restore();

  // Tid nå
  const now = new Date();
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const ms = now.getMilliseconds();

  // Vinkelberegninger
  const secondAngle = ((second + ms / 1000) * Math.PI) / 30;
  const minuteAngle = ((minute + second / 60) * Math.PI) / 30;
  const hourAngle = ((hour + minute / 60) * Math.PI) / 6;

  // Visere
  function drawHand(angle, length, width, color) {
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 8);            // litt bak midten for estetikk
    ctx.lineTo(0, -length);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  // Timeviser
  drawHand(hourAngle, radius * 0.50, 5, "#111111");

  // Minuttviser
  drawHand(minuteAngle, radius * 0.70, 4, "#333333");

  // Sekundviser (rød)
  drawHand(secondAngle, radius * 0.80, 2, "#d12a2a");

  // Senterknapp
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#333333";
  ctx.fill();
}

// ⏱ Oppdateringstimer
function tick() {
  updateDateTime();
  drawAnalogClock();
}

updateDateTime();
drawAnalogClock();
setInterval(tick, 1000);
