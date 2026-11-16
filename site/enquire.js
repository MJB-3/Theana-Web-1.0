(function () {
  var form = document.querySelector('form.enquiry');
  if (!form) return;
  var el = function (n) { return form.elements[n]; };
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type=submit]');

  // Pre-fill from links like /enquire?type=reserve&product=culinary
  var params = new URLSearchParams(location.search);
  var type = params.get('type');
  if (type && el('type').querySelector('option[value="' + type + '"]')) el('type').value = type;
  var product = params.get('product') || (type === 'white-label' ? 'white-label' : null);
  if (product) {
    var box = form.querySelector('input[name=products][value="' + product + '"]');
    if (box) box.checked = true;
  }
  if (type === 'deck') el('business').value = 'Investor';

  function show(state, msg) {
    status.setAttribute('data-state', state);
    status.textContent = msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!el('name').value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el('email').value.trim())) {
      show('error', 'Please add your name and a valid email.');
      return;
    }
    button.disabled = true;
    button.textContent = 'Sending…';
    fetch(form.getAttribute('action'), { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          show('ok', 'Thank you. Your enquiry is in, and we will reply within two working days.');
          button.textContent = 'Sent';
        } else {
          throw new Error(res.d.error || 'failed');
        }
      })
      .catch(function () {
        show('error', 'Sorry, that did not go through. Please email hello@theanabio.com instead.');
        button.disabled = false;
        button.textContent = 'Send enquiry';
      });
  });
})();
