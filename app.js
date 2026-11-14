(function () {
  'use strict';

  var CURRENCIES = [
    { code: 'USD', icon: '$',  name: 'United States Dollar' },
    { code: 'EUR', icon: '€',  name: 'Euro' },
    { code: 'GBP', icon: '£',  name: 'British Pound Sterling' },
    { code: 'CAD', icon: 'C$', name: 'Canadian Dollar' },
    { code: 'CNY', icon: '¥',  name: 'Chinese Yuan (Renminbi)' },
    { code: 'JPY', icon: '¥',  name: 'Japanese Yen' },
    { code: 'THB', icon: '฿',  name: 'Thai Baht' },
    { code: 'CHF', icon: 'Fr', name: 'Swiss Franc' },
    { code: 'AUD', icon: 'A$', name: 'Australian Dollar' },
    { code: 'TRY', icon: '₺',  name: 'Turkish Lira' }
  ];
  var NIS = { code: 'NIS', icon: '₪', name: 'Israeli New Shekel' };
  var STALE_MS = 24 * 60 * 60 * 1000;

  var $ = function (id) { return document.getElementById(id); };
  var state = { rates: {}, list: [], selected: 'USD', toNis: false };

  function fmt(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function badge(cur) {
    var s = document.createElement('span');
    s.className = 'cur';
    s.tabIndex = 0;
    s.setAttribute('data-name', cur.name);
    s.setAttribute('title', cur.name);
    s.setAttribute('aria-label', cur.name + ' (' + cur.code + ')');
    var i = document.createElement('span');
    i.className = 'icon';
    i.setAttribute('aria-hidden', 'true');
    i.textContent = cur.icon;
    s.appendChild(i);
    s.appendChild(document.createTextNode(cur.code));
    return s;
  }

  function setBadge(id, cur) {
    var el = $(id);
    el.replaceChildren(badge(cur));
  }

  // NIS per 1 unit of foreign currency (data stores foreign units per 1 NIS)
  function nisPer(code) { return 1 / state.rates[code]; }

  function find(code) {
    return CURRENCIES.filter(function (c) { return c.code === code; })[0];
  }

  function validate(raw) {
    var v = raw.trim();
    if (v === '') return { empty: true };
    if (/^-\s*\d*\.?\d*$/.test(v)) return { error: 'Please enter a positive amount.' };
    if (!/^\d*\.?\d*$/.test(v) || v === '.') return { error: 'Please enter numbers only (for example 19.99).' };
    if (/\.\d{3,}$/.test(v)) return { error: 'Please use up to 2 digits after the decimal point.' };
    var n = parseFloat(v);
    if (!(n > 0)) return { error: 'Please enter a positive amount.' };
    return { value: n };
  }

  function update() {
    var cur = find(state.selected);
    var from = state.toNis ? cur : NIS;
    var to = state.toNis ? NIS : cur;
    setBadge('from-badge', from);
    setBadge('to-badge', to);

    var v = validate($('amount').value);
    var err = $('amount-error');
    var box = document.querySelector('.amount-box');
    var out = $('result');
    var summary = $('summary');

    err.hidden = !v.error;
    err.textContent = v.error || '';
    box.classList.toggle('invalid', !!v.error);
    $('amount').setAttribute('aria-invalid', v.error ? 'true' : 'false');

    if (v.error) { out.textContent = '—'; summary.textContent = ''; return; }
    if (v.empty) { out.textContent = '—'; summary.textContent = 'Enter an amount to convert.'; return; }

    var result = state.toNis ? v.value * nisPer(cur.code) : v.value * state.rates[cur.code];
    out.textContent = fmt(result);
    summary.textContent = fmt(v.value) + ' ' + from.code + ' = ' + fmt(result) + ' ' + to.code;
  }

  function select(code) {
    state.selected = code;
    $('currency').value = code;
    var cards = document.querySelectorAll('.card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle('selected', cards[i].getAttribute('data-code') === code);
    }
    update();
  }

  function renderCards() {
    var wrap = $('cards');
    wrap.replaceChildren();
    state.list.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'card';
      b.setAttribute('data-code', c.code);
      b.appendChild(badge(c));
      var r = document.createElement('span');
      r.className = 'rate';
      r.appendChild(document.createTextNode('1 ' + c.code + ' = '));
      var s = document.createElement('strong');
      var perUnit = nisPer(c.code);
      s.textContent = perUnit < 1
        ? perUnit.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
        : fmt(perUnit);
      r.appendChild(s);
      r.appendChild(document.createTextNode(' NIS'));
      b.appendChild(r);
      b.addEventListener('click', function () { select(c.code); });
      wrap.appendChild(b);
    });
  }

  function renderSelect() {
    var sel = $('currency');
    sel.replaceChildren();
    state.list.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.code;
      o.textContent = c.icon + ' ' + c.code + ' – ' + c.name;
      sel.appendChild(o);
    });
  }

  function showError() {
    $('error-panel').hidden = false;
    $('converter').hidden = true;
    $('rates').hidden = true;
    $('stale-notice').hidden = true;
    $('updated').textContent = '';
  }

  function formatDate(d) {
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function init(data) {
    if (!data || typeof data.rates !== 'object' || !data.updatedAt) throw new Error('Invalid rates file');
    var updated = new Date(data.updatedAt);
    if (isNaN(updated)) throw new Error('Invalid updatedAt');

    state.rates = {};
    state.list = CURRENCIES.filter(function (c) {
      var r = Number(data.rates[c.code]);
      if (r > 0 && isFinite(r)) { state.rates[c.code] = r; return true; }
      return false;
    });
    if (!state.list.length) throw new Error('No usable rates');

    if (!state.rates[state.selected]) state.selected = state.list[0].code;

    $('error-panel').hidden = true;
    $('converter').hidden = false;
    $('rates').hidden = false;

    renderSelect();
    renderCards();

    var when = formatDate(updated);
    $('updated').textContent = 'Last updated: ' + when;
    var stale = Date.now() - updated.getTime() > STALE_MS;
    var notice = $('stale-notice');
    notice.hidden = !stale;
    notice.textContent = stale ? 'These rates may be out of date. Last updated: ' + when + '.' : '';

    select(state.selected);
  }

  function load() {
    fetch('data/rates.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(init)
      .catch(function (e) {
        console.error('Could not load rates:', e);
        showError();
      });
  }

  $('amount').addEventListener('input', update);
  $('currency').addEventListener('change', function (e) { select(e.target.value); });
  $('swap').addEventListener('click', function () { state.toNis = !state.toNis; update(); });
  $('retry').addEventListener('click', load);

  load();
})();
