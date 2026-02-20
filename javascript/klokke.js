//dato og tid (digital)
function updateDateTime() {
  const now = new Date();
  const el = document.getElementById("currentDateTime");
  if (el) {
    const pad = (value) => String(value).padStart(2, "0");
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const dateStr = now.toLocaleDateString("nb-NO", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const daysLeft = getDaysLeftInYear(now);
    if (!el.querySelector(".digital-clock__time")) {
      el.innerHTML = `
        <span class="digital-clock__time">
          <span class="digital-clock__digits" data-part="hours">
            <span class="digital-clock__digit"></span><span class="digital-clock__digit"></span>
          </span>
          <span class="digital-clock__colon">:</span>
          <span class="digital-clock__digits" data-part="minutes">
            <span class="digital-clock__digit"></span><span class="digital-clock__digit"></span>
          </span>
          <span class="digital-clock__colon">:</span>
          <span class="digital-clock__digits" data-part="seconds">
            <span class="digital-clock__digit"></span><span class="digital-clock__digit"></span>
          </span>
        </span>
        <span class="digital-clock__date"></span>
        <span class="digital-clock__meta"></span>
      `;
    }

    const digitsMap = {
      hours: pad(now.getHours()),
      minutes: pad(now.getMinutes()),
      seconds: pad(now.getSeconds()),
    };
    Object.entries(digitsMap).forEach(([part, value]) => {
      const group = el.querySelector(`.digital-clock__digits[data-part="${part}"]`);
      if (!group) return;
      const digitEls = Array.from(group.querySelectorAll(".digital-clock__digit"));
      value.split("").forEach((digit, index) => {
        const digitEl = digitEls[index];
        if (!digitEl) return;
        if (digitEl.textContent !== digit) {
          digitEl.textContent = digit;
          digitEl.classList.remove("is-ticking");
          void digitEl.offsetWidth;
          digitEl.classList.add("is-ticking");
        }
      });
    });

    const dateEl = el.querySelector(".digital-clock__date");
    const metaEl = el.querySelector(".digital-clock__meta");
    if (dateEl) dateEl.textContent = `${dateStr} (uke ${getIsoWeek(now)})`;
    if (metaEl) metaEl.textContent = `${daysLeft} dager igjen av ${now.getFullYear()}`;
  }
}

function getIsoWeek(date) {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

function getDaysLeftInYear(date) {
  const year = date.getFullYear();
  const start = new Date(year, 0, 1);
  const today = new Date(year, date.getMonth(), date.getDate());
  const dayOfYear = Math.floor((today - start) / 86400000) + 1;
  const daysInYear = new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
  return Math.max(0, daysInYear - dayOfYear);
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
