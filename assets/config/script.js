AOS.init({
  duration: 1200,
  once: true,
  offset: 100,
  easing: "ease-out-cubic",
});

// Custom Cursor
function initCustomCursor() {
  if (window.innerWidth <= 768) return; // Skip on mobile

  const cursor = document.querySelector(".custom-cursor");
  const interactiveElements = document.querySelectorAll(
    "a, button, .btn-custom, .social-link, .nav-link"
  );

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX - 10 + "px";
    cursor.style.top = e.clientY - 10 + "px";
  });

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });
}

function createEnhancedParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleTypes = ["type-1", "type-2", "type-3"];

  for (let i = 0; i < 80; i++) {
    const particle = document.createElement("div");
    const type =
      particleTypes[Math.floor(Math.random() * particleTypes.length)];

    particle.className = `particle ${type}`;
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particle.style.animationDuration = 4 + Math.random() * 4 + "s";

    particlesContainer.appendChild(particle);
  }
}

function enhancedNameAnimation() {
  const text = "AHMAD KURNIAWAN";
  const element = document.getElementById("typewriter");
  let i = 0;

  element.textContent = "";
  element.style.opacity = "1";
  element.style.transform = "none";

  function addNextChar() {
    if (i < text.length) {
      element.textContent = text.substring(0, i + 1);
      i++;
      setTimeout(addNextChar, 120);
    }
  }

  addNextChar();
}

function enhancedRotatingText() {
  const skills = [
    "Frontend Development",
    "Backend Development",
    "Mobile Development",
    "UI/UX Design",
    "Database Management",
    "DevOps & Cloud",
    "API Development",
    "Security",
    "Machine Learning",
    "FiveM Development",
  ];

  const skillElement = document.getElementById("rotating-text");
  const cursor = document.querySelector(".typing-cursor");
  const container = document.querySelector(".skills-input-container");
  let currentIndex = 0;

  skillElement.textContent = skills[0];
  skillElement.style.transition =
    "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
  cursor.style.display = "inline";

  function animateSkillChange() {
    container.style.borderColor = "var(--primary-color)";
    container.style.boxShadow =
      "0 0 40px rgba(0, 212, 255, 0.6), inset 0 0 20px rgba(0, 212, 255, 0.1)";
    container.style.transform = "translateY(-3px) scale(1.02)";
    skillElement.style.opacity = "0";
    skillElement.style.transform = "translateY(-20px) scale(0.9)";
    skillElement.style.filter = "blur(5px)";

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % skills.length;
      skillElement.textContent = skills[currentIndex];

      setTimeout(() => {
        skillElement.style.opacity = "1";
        skillElement.style.transform = "translateY(0) scale(1)";
        skillElement.style.filter = "blur(0px)";

        skillElement.style.color = "var(--accent-color)";
        setTimeout(() => {
          skillElement.style.color = "var(--primary-color)";
        }, 200);

        setTimeout(() => {
          container.style.borderColor = "rgba(0, 212, 255, 0.4)";
          container.style.boxShadow = "0 0 30px rgba(0, 212, 255, 0.3)";
          container.style.transform = "translateY(0) scale(1)";
        }, 400);
      }, 50);
    }, 300);
  }

  function breathingAnimation() {
    container.style.transition = "all 2s ease-in-out";
    container.style.boxShadow = "0 0 35px rgba(0, 212, 255, 0.4)";

    setTimeout(() => {
      container.style.boxShadow = "0 0 25px rgba(0, 212, 255, 0.2)";
    }, 1000);
  }

  setInterval(breathingAnimation, 2000);

  setInterval(animateSkillChange, 3500);
}

function enhancedScrollEffects() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.style.background = "rgba(10, 10, 10, 0.98)";
      navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
    } else {
      navbar.style.background = "rgba(10, 10, 10, 0.9)";
      navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.3)";
    }

    const shapes = document.querySelectorAll(".shape");
    shapes.forEach((shape, index) => {
      const speed = 0.5 + index * 0.1;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}


function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function initFormHandling() {
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const button = this.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;

    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
      button.style.background =
        "linear-gradient(45deg, var(--accent-green), var(--accent-green))";

      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        button.style.background = "";
        this.reset();
      }, 2000);
    }, 1500);
  });
}

function initClickEffects() {
  const interactiveElements = document.querySelectorAll(
    ".btn-custom, .social-link, .tech-tag"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255, 255, 255, 0.3)";
      ripple.style.pointerEvents = "none";
      ripple.style.animation = "ripple 0.6s ease-out";

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  const style = document.createElement("style");
  style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", function () {
  initCustomCursor();
  createEnhancedParticles();
  enhancedScrollEffects();
  initSmoothScrolling();
  initFormHandling();
  initClickEffects();
  setTimeout(enhancedNameAnimation, 100);
  setTimeout(enhancedRotatingText, 3500);
});

function optimizePerformance() {
  let ticking = false;

  function updateAnimations() {
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateAnimations);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
}

optimizePerformance();
