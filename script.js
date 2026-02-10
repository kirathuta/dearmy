/*
  script.js
  ---------
  Handles:
  - Typing effect for the message section
  - Fade-in on scroll using IntersectionObserver
  - Smooth confetti burst when the "One last thing" button is clicked
*/

// Wait for DOM to load before running scripts
document.addEventListener("DOMContentLoaded", () => {
  setupTypingEffect();
  setupScrollReveal();
  setupSurpriseButton();
});

/* -------------------------------
   1. Typing / fade-up Message Text
---------------------------------- */

/**
 * Slowly types the message into the message element.
 * The effect is intentionally soft & unhurried.
 */
function setupTypingEffect() {
  const messageEl = document.getElementById("typed-message");
  if (!messageEl) return;

  // You can safely tweak this text to make it more "you"
  const fullMessage = [
    "Happy Birthday ပါ ဟန်နီ🎉",
    "အချိန်တစ်ခု အကြာမှာ ကိုယ့်ရဲ့ဘဝထဲ ပြန်ရောက်လာပေးခဲ့တဲ့ အတွက် ကျေးဇူးတင်ပါတယ် 💗",
    "ဒီနှစ်မွေးနေ့ကနေ စပြီး အနာဂတ်မှာလည်း မေ့ဘဝထဲမှာ ပျော်ရွှင်မှုတွေ၊ အောင်မြင်မှုတွေ၊ အချစ်တွေ ပြည့်စုံပါစေလို့ဒီကဆုတောင်းပေးလိုက်ပါတယ်။",
    "",
    "ဒီ website လေးက မေ့အတွက် အမှတ်တရတစ်ခုအနေနဲ့ ကျန်ရှိနေမယ် ဆိုရင် ကျေနပ်ပါတယ်"
  ].join("\n");

  const chars = Array.from(fullMessage);
  let index = 0;
  const typingDelay = 32; // smaller = faster typing

  // Optional: small initial delay so it doesn't start instantly
  const initialDelay = 400;

  setTimeout(() => {
    const interval = setInterval(() => {
      messageEl.textContent += chars[index] || "";
      index++;

      if (index >= chars.length) {
        clearInterval(interval);
      }
    }, typingDelay);
  }, initialDelay);
}

/* -------------------------------
   2. Fade-in on Scroll
---------------------------------- */

/**
 * Uses IntersectionObserver to add a "visible" class
 * when elements enter the viewport. CSS handles the
 * actual fade / slide animations.
 */
function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal-on-scroll");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  items.forEach((item) => observer.observe(item));
}

/* -------------------------------
   3. Confetti + Surprise Message
---------------------------------- */

/**
 * Very lightweight confetti effect using a <canvas> and requestAnimationFrame.
 * This is intentionally simple and short-lived to keep the page clean.
 */
function setupSurpriseButton() {
  const button = document.getElementById("surprise-button");
  const message = document.getElementById("surprise-message");
  const canvas = document.getElementById("confetti-canvas");

  if (!button || !message || !canvas) return;

  const ctx = canvas.getContext("2d");
  let confettiPieces = [];
  let animationFrameId;

  // Resize canvas to fit window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Simple helper to create confetti pieces
  function createConfettiBurst(x, y, count = 120) {
    const colors = ["#f29fb4", "#c3b3ff", "#f5d59c", "#ffffff"];

    confettiPieces = [];
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        speed: 3 + Math.random() * 4,
        size: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        spin: (Math.random() - 0.5) * 0.2,
        alpha: 1,
        decay: 0.01 + Math.random() * 0.015
      });
    }
  }

  // Draw and update confetti each frame
  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((p) => {
      // Move outward
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed + 0.5; // slight downward pull
      p.angle += p.spin;
      p.alpha -= p.decay;

      // Draw each particle as a tiny rounded rectangle
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.fillStyle = p.color;
      const w = p.size;
      const h = p.size * 2;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.restore();
    });

    // Stop when all pieces are invisible
    confettiPieces = confettiPieces.filter((p) => p.alpha > 0);
    if (confettiPieces.length > 0) {
      animationFrameId = requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameId);
    }

    // reset alpha so other drawings aren’t affected
    ctx.globalAlpha = 1;
  }

button.addEventListener("click", () => {
  // If it's already open, close it and stop here
  if (message.classList.contains("visible")) {
    message.classList.remove("visible");
    return;
  }

  // Otherwise, open it and show confetti once
  message.classList.add("visible");

  // Center of the button for the confetti burst
  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  createConfettiBurst(x, y);

  cancelAnimationFrame(animationFrameId);
  renderConfetti();

  button.classList.add("clicked");
  setTimeout(() => {
    button.classList.remove("clicked");
  }, 220);
});
}