(function () {
  var form = document.querySelector('form.enquiry');
  if (!form) return;
  var el = function (n) { return form.elements[n]; };
  var status = form.querySelector('.form-status');
  var TO = 'hello@theanabio.com';
  var TYPES = { samples: 'Sample request', reserve: '2027 volume reservation', 'white-label': 'White label', deck: 'Investor deck request', other: 'General enquiry' };

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

  function show(state, msg) { status.setAttribute('data-state', state); status.textContent = msg; }
  function val(n) { return (el(n).value || '').trim(); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!val('name') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) {
      show('error', 'Please add your name and a valid email.');
      return;
    }
    var products = Array.prototype.map.call(form.querySelectorAll('input[name=products]:checked'), function (b) { return b.parentNode.textContent.trim(); });
    var label = TYPES[val('type')] || TYPES.other;
    var lines = [
      ['Type', label], ['Name', val('name')], ['Email', val('email')], ['Company', val('company')],
      ['Country', val('country')], ['Business', val('business')], ['Volume / month', val('volume')], ['Products', products.join(', ')]
    ].filter(function (r) { return r[1]; }).map(function (r) { return r[0] + ': ' + r[1]; });
    var body = lines.join('\n') + (val('message') ? '\n\n' + val('message') : '') + '\n\n(Sent from theanabio.com/enquire)';
    var subject = label + ': ' + (val('company') || val('name'));
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    show('ok', 'Your email app should now open with your enquiry filled in. Press send. If nothing opened, email ' + TO + ' directly.');
  });
})();
