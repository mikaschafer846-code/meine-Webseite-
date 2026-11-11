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
