//dato og tid (digital)
function updateDateTime() {
  const now = new Date();
  const el = document.getElementById("currentDateTime");
  if (el) el.innerText = now.toLocaleString("nb-NO");
}

//analog klokke (canvas)
function drawAnalogClock() {
  const canvas = document.getElementById("analogClock");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rootStyles = getComputedStyle(document.documentElement);
  const getVar = (name, fallback) => rootStyles.getPropertyValue(name).trim() || fallback;
  const rgb = (value, alpha = 1) => {
    if (!value) return alpha === 1 ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.8)";
    return alpha === 1 ? `rgb(${value})` : `rgba(${value}, ${alpha})`;
  };

  const accent = getVar("--color-button-accent", getVar("--color", "186, 145, 255"));
  const textBase = getVar("--color-text-base", "241, 243, 248");
  const textMuted = getVar("--color-text-muted", "167, 174, 191");
  const bgElevated = getVar("--color-bg-elevated", "18, 24, 40");
  const bgInput = getVar("--color-bg-input", "14, 20, 36");
  const border = getVar("--color-border", "42, 50, 70");

  //skarp på høy-dpi skjermer (retina)
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const size = Math.round(Math.min(rect.width, rect.height));
  if (size <= 0) return;
  if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
    canvas.width = size * dpr;
    canvas.height = size * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const radius = size / 2;
  ctx.clearRect(0, 0, size, size);

  //midtpunkt
  ctx.save();
  ctx.translate(radius, radius);

  //bakgrunn (moderne, uten ramme)
  ctx.beginPath();
  ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
  const faceGradient = ctx.createRadialGradient(0, -radius * 0.2, radius * 0.2, 0, 0, radius);
  faceGradient.addColorStop(0, rgb(bgInput, 0.95));
  faceGradient.addColorStop(1, rgb(bgElevated, 0.95));
  ctx.fillStyle = faceGradient;
  ctx.fill();

  //markører (moderne prikker + subtile minuttstreker)
  ctx.save();
  ctx.strokeStyle = rgb(textMuted, 0.6);
  ctx.fillStyle = rgb(textBase, 0.9);
  ctx.lineCap = "round";

  //minuttstreker
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30;
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -(radius - 10));
    ctx.lineTo(0, -(radius - (i % 5 === 0 ? 20 : 16)));
    ctx.lineWidth = i % 5 === 0 ? 2.2 : 1;
    ctx.stroke();
    ctx.rotate(-angle);
  }

  //timeprikker
  for (let n = 1; n <= 12; n++) {
    const angle = (n * Math.PI) / 6;
    const tx = Math.sin(angle) * (radius - 26);
    const ty = -Math.cos(angle) * (radius - 26);
    ctx.beginPath();
    ctx.arc(tx, ty, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  //tid nå
  const now = new Date();
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const ms = now.getMilliseconds();

  //vinkelberegninger
  const secondAngle = ((second + ms / 1000) * Math.PI) / 30;
  const minuteAngle = ((minute + second / 60 + ms / 60000) * Math.PI) / 30;
  const hourAngle = ((hour + minute / 60 + second / 3600) * Math.PI) / 6;

  //visere
  function drawHand(angle, length, width, color) {
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 8);            //litt bak midten for estetikk
    ctx.lineTo(0, -length);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  //timeviser
  drawHand(hourAngle, radius * 0.50, 5, rgb(textBase, 0.95));

  //minuttviser
  drawHand(minuteAngle, radius * 0.70, 4, rgb(textMuted, 0.95));

  //sekundviser (rød)
  drawHand(secondAngle, radius * 0.82, 1.6, rgb(accent, 1));

  //senterknapp
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fillStyle = rgb(accent, 1);
  ctx.fill();

  //ingen ytre ring (bevisst moderne)

  ctx.restore();
}

//smooth animasjon
let lastSecond = -1;
function tick() {
  const now = new Date();
  const sec = now.getSeconds();
  if (sec !== lastSecond) {
    updateDateTime();
    lastSecond = sec;
  }
  drawAnalogClock();
  requestAnimationFrame(tick);
}

updateDateTime();
drawAnalogClock();
requestAnimationFrame(tick);
