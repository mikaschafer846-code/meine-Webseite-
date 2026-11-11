// Jahr im Footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobiles Menü
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
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

// Kontaktformular (Demo – sendet noch nichts ab)
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('form-status').textContent =
    'Vielen Dank für Ihre Anfrage! (Demo: Das Formular ist noch nicht mit einem Dienst verbunden.)';
  e.target.reset();
});
