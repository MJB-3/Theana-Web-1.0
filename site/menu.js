(function () {
  var btn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var open = menu.getAttribute('data-open') !== 'true';
    menu.setAttribute('data-open', String(open));
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.setAttribute('data-open', 'false'); btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menu'; }
  });
})();
