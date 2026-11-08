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

// Contact form → Google Sheet (via the Apps Script web app in apps-script/Code.gs)
(function () {
  var form = document.querySelector('#inquiry-form');
  if (!form) return;
  var note = document.querySelector('#form-note');
  var button = form.querySelector('button[type="submit"]');
  function say(text, isError) {
    note.textContent = text;
    note.classList.toggle('error', !!isError);
    note.hidden = false;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.querySelector('input[name="services"]:checked')) {
      say('Please select at least one service.', true);
      return;
    }
    var endpoint = form.dataset.endpoint;
    if (!endpoint || endpoint.indexOf('PASTE_') === 0) {
      say('This form isn\u2019t connected yet. Please reach out on Instagram instead.', true);
      return;
    }
    button.disabled = true;
    say('Sending\u2026');
    fetch(endpoint, { method: 'POST', body: new FormData(form) })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.result !== 'ok') throw new Error(data.error);
        form.reset();
        say('Thank you! Your inquiry is on its way. You\u2019ll hear back within 48 hours.');
      })
      .catch(function () {
        say('Sorry, that didn\u2019t go through. Please try again in a moment.', true);
      })
      .then(function () { button.disabled = false; });
  });
})();
