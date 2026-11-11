// Jahr im Footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Header bekommt beim Scrollen einen Hintergrund
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobiles Menü
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Fischgrät-Parkett im Hero, das sich Diele für Diele selbst verlegt
const floor = document.getElementById('floor');
if (floor) {
  const u = window.innerWidth < 860 ? 34 : 46;          // Breite einer Diele in px
  const woods = ['#8a5a32', '#9a6639', '#7b4e2a', '#a8723f', '#93603a', '#80542f'];
  const range = 16;
  const frag = document.createDocumentFragment();
  // Fischgrät-Muster: Pro Strang wechseln sich liegende und stehende Dielen ab
  for (let s = -6; s <= 6; s++) {
    for (let k = -range; k <= range; k++) {
      const y = k + 4 * s;
      for (const [x, yy, w, h] of [[k, y, 2, 1], [k, y + 1, 1, 2]]) {
        const p = document.createElement('div');
        p.className = 'plank';
        p.style.left = x * u + 'px';
        p.style.top = yy * u + 'px';
        p.style.width = w * u - 2 + 'px';
        p.style.height = h * u - 2 + 'px';
        p.style.background = woods[Math.floor(Math.random() * woods.length)];
        // Verlegereihenfolge: von links nach rechts über die Fläche
        const order = (k + range) * 0.6 + (s + 6) * 0.9 + Math.random() * 2;
        p.style.animationDelay = (0.3 + order * 0.045).toFixed(2) + 's';
        frag.appendChild(p);
      }
    }
  }
  floor.appendChild(frag);
}

// Elemente beim Scrollen einblenden
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .step').forEach((el) => io.observe(el));

// Kontaktformular: fertige E-Mail im Mailprogramm öffnen
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const leistungen = d.getAll('leistung');
    const betreff = 'Anfrage' + (leistungen.length ? ': ' + leistungen.join(', ') : '') + ' – ' + d.get('name');
    const text =
      'Hallo MS Montagen,\n\n' +
      d.get('nachricht') + '\n\n' +
      (leistungen.length ? 'Leistungen: ' + leistungen.join(', ') + '\n' : '') +
      (d.get('ort') ? 'Ort: ' + d.get('ort') + '\n' : '') +
      '\nViele Grüße\n' + d.get('name');
    window.location.href =
      'mailto:msmontagen@gmail.com?subject=' + encodeURIComponent(betreff) +
      '&body=' + encodeURIComponent(text);
  });
}
