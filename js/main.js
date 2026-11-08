// Wellspring Writes — small site behaviors

// Mobile menu toggle
(function () {
  var btn = document.querySelector('.menu-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) btn.click();
  });
})();

// Footer year
document.querySelectorAll('[data-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Contact form — VISUAL ONLY for now.
// TODO: connect to a form service (e.g. Formspree or Netlify Forms) and remove this handler.
(function () {
  var form = document.querySelector('#inquiry-form');
  if (!form) return;
  var note = document.querySelector('#form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.querySelector('input[name="services"]:checked')) {
      note.textContent = 'Please select at least one service.';
      note.hidden = false;
      return;
    }
    note.textContent = 'Thank you! (This form is not connected yet, so nothing was sent.)';
    note.hidden = false;
  });
})();
