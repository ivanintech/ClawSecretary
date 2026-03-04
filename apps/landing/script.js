// ClawSecretary Landing Page — Micro-interactions & Animations

// Intersection Observer for scroll-reveal animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// Apply to all cards and steps
document.querySelectorAll(
  '.feature-card, .step, .pricing-card, .mockup-card, .wal-card'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
  observer.observe(el);
});

// Typewriter effect for hero subtitle
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const originalText = heroSub.innerHTML;
  // Just add a subtle fade-in
  heroSub.style.opacity = '0';
  heroSub.style.transition = 'opacity 0.8s ease 0.4s';
  setTimeout(() => { heroSub.style.opacity = '1'; }, 100);
}

// Nav scroll effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(2, 8, 23, 0.97)';
    nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
  } else {
    nav.style.background = 'rgba(2, 8, 23, 0.85)';
    nav.style.boxShadow = 'none';
  }
}, { passive: true });

// Animated counter for stats
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1500;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

// Trigger stat counters when in view
const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const text = entry.target.textContent;
      if (text === '100%') animateCounter(entry.target, 100, '%');
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach((el) => statsObserver.observe(el));

// Smooth active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}`
            ? '#f1f5f9'
            : '';
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

console.log('ClawSecretary Landing Page — Ready 🦞🚀');
