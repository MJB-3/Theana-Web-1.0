// Embeds the Tally enquiry form and passes which button the visitor clicked
// (e.g. /enquire?type=reserve&product=culinary) into Tally hidden fields "type" and "product".
(function () {
  var frame = document.getElementById('tally-form');
  if (!frame) return;
  var params = new URLSearchParams(location.search);
  var q = ['alignLeft=1', 'hideTitle=1', 'transparentBackground=1', 'dynamicHeight=1'];
  ['type', 'product'].forEach(function (k) {
    var v = params.get(k);
    if (v && /^[a-z0-9-]{1,40}$/.test(v)) q.push(k + '=' + encodeURIComponent(v));
  });
  frame.setAttribute('data-tally-src', frame.getAttribute('data-tally-base') + '?' + q.join('&'));

  var load = function () {
    if (typeof Tally !== 'undefined') Tally.loadEmbeds();
    else frame.src = frame.getAttribute('data-tally-src');
  };
  var s = document.createElement('script');
  s.src = 'https://tally.so/widgets/embed.js';
  s.onload = load; s.onerror = load;
  document.body.appendChild(s);
})();
