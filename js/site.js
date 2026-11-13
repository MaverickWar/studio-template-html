// Small, dependency-free behaviour for the starter site: the phone menu, the contact form's checks,
// the brand letter and the year in the footer.
(function () {
  // Phone menu
  var button = document.querySelector('.menu-button');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Close' : 'Menu';
    nav.setAttribute('data-open', String(open));
  }
  button.addEventListener('click', function () { setMenu(button.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // The first letter of the project's name in the brand mark, once the adapter has filled it in.
  function brandLetter() {
    var name = document.querySelector('.brand [data-studio-name]');
    var mark = document.querySelector('.brand .mark');
    if (name && mark) mark.textContent = (name.textContent.trim()[0] || 'S').toUpperCase();
  }
  new MutationObserver(brandLetter).observe(document.documentElement, { attributes: true, attributeFilter: ['data-studio-ready'] });
  brandLetter();

  document.getElementById('year').textContent = String(new Date().getFullYear());

  // Contact form: checks each field and shows a plain message next to anything missing.
  var form = document.getElementById('contact-form');
  var checks = {
    name: function (v) { return v.trim().length > 0; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    message: function (v) { return v.trim().length > 0; },
  };
  function check(field) {
    var ok = checks[field.name](field.value);
    field.setAttribute('aria-invalid', String(!ok));
    document.getElementById(field.name + '-error').hidden = ok;
    return ok;
  }
  // Clear a field's message as soon as it is fixed (while typing), so nothing jumps when Send is pressed.
  Object.keys(checks).forEach(function (n) {
    form.elements[n].addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') check(e.target);
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = Object.keys(checks).map(function (n) { return form.elements[n]; }).filter(function (f) { return !check(f); });
    if (bad.length) { bad[0].focus(); return; }
    // To really send it, post new FormData(form) to your form service (Formspree, Netlify Forms, your own API) here.
    form.reset();
    document.getElementById('form-sent').hidden = false;
  });
})();
