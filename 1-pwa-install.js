/* حرب العصيان 2 - PWA install helper */
(function () {
  var LINK = 'https://moemnquiz.github.io/stick-clash-app.html';
  var deferred = null;
  var ua = navigator.userAgent || '';
  var inApp = /WhatsApp|FBAN|FBAV|Instagram|Line\/|MicroMessenger|Snapchat|Twitter/i.test(ua);

  function isStandalone() {
    try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }
    catch (e) { return false; }
  }
  function liftTopBar() {
    var t = document.getElementById('top');
    if (t) t.style.zIndex = '6';
  }
  function hideBtn() {
    var b = document.getElementById('pwa-install');
    if (b) b.remove();
  }
  function makeBtn() {
    if (isStandalone()) return;
    if (document.getElementById('pwa-install')) return;
    var b = document.createElement('button');
    b.id = 'pwa-install';
    b.type = 'button';
    b.className = 'sm';
    b.textContent = '📲 ثبّت';
    b.title = 'ثبّت اللعبة على الموبايل';
    b.style.pointerEvents = 'auto';
    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (deferred) {
        var d = deferred;
        deferred = null;
        try { d.prompt(); } catch (e) { help(); }
      } else {
        help();
      }
    });
    var btns = document.getElementById('btns');
    if (btns) {
      btns.appendChild(b);
    } else {
      b.style.position = 'fixed';
      b.style.top = '8px';
      b.style.left = '8px';
      b.style.zIndex = '99999';
      document.body.appendChild(b);
    }
  }
  function help() {
    if (document.getElementById('pwa-help')) return;
    var w = document.createElement('div');
    w.id = 'pwa-help';
    w.setAttribute('style', 'position:fixed;inset:0;z-index:99999;background:#000c;display:flex;align-items:flex-end;justify-content:center;padding:14px;direction:rtl');
    var c = document.createElement('div');
    c.setAttribute('style', 'background:#241a0c;border:2px solid #e8b94a;border-radius:16px;padding:16px;max-width:430px;width:100%;color:#fff;font:600 15px/1.7 system-ui,-apple-system,Tahoma,Arial,sans-serif;box-shadow:0 10px 30px #000a');
    var t = document.createElement('div');
    t.setAttribute('style', 'font-weight:800;font-size:18px;margin-bottom:10px;color:#ffd54a');
    t.textContent = 'تثبيت اللعبة على الموبايل';
    c.appendChild(t);
    var p = document.createElement('div');
    if (inApp) {
      p.innerHTML = 'انت فاتح اللينك من جوه واتساب، وواتساب مش بيثبّت تطبيقات.<br>دوس على النقط <b>⋮</b> فوق واختار <b>فتح في كروم</b>، وبعدها هتلاقي زرار <b>📲 ثبّت</b> فوق في اللعبة.';
    } else {
      p.innerHTML = 'من قائمة كروم <b>⋮</b> فوق اختار <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b>.<br>ولو الزرار مظهرش، انسخ اللينك وافتحه في كروم.';
    }
    c.appendChild(p);
    var lk = document.createElement('div');
    lk.setAttribute('style', 'margin-top:10px;font-size:12px;opacity:.75;word-break:break-all;direction:ltr;text-align:left');
    lk.textContent = LINK;
    c.appendChild(lk);
    var row = document.createElement('div');
    row.setAttribute('style', 'display:flex;gap:8px;margin-top:12px');
    var cp = document.createElement('button');
    cp.type = 'button';
    cp.textContent = '📋 انسخ اللينك';
    cp.setAttribute('style', 'flex:1;padding:11px;border-radius:12px;border:2px solid #e8b94a;background:#3a2a14;color:#fff;font-weight:800;font-size:15px');
    cp.addEventListener('click', function () {
      var done = function () { cp.textContent = '✓ اتنسخ'; };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(LINK).then(done, function () { legacyCopy(); done(); });
        } else { legacyCopy(); done(); }
      } catch (e) { legacyCopy(); done(); }
      function legacyCopy() {
        try {
          var ta = document.createElement('textarea');
          ta.value = LINK;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        } catch (e2) {}
      }
    });
    var cl = document.createElement('button');
    cl.type = 'button';
    cl.textContent = 'تمام';
    cl.setAttribute('style', 'flex:1;padding:11px;border-radius:12px;border:2px solid #ffd54a;background:linear-gradient(#e8452f,#8c1f12);color:#fff;font-weight:800;font-size:15px');
    cl.addEventListener('click', function () { w.remove(); });
    row.appendChild(cp);
    row.appendChild(cl);
    c.appendChild(row);
    w.appendChild(c);
    w.addEventListener('click', function (e) { if (e.target === w) w.remove(); });
    document.body.appendChild(w);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    makeBtn();
  });
  window.addEventListener('appinstalled', function () {
    deferred = null;
    hideBtn();
  });
  window.addEventListener('load', function () {
    liftTopBar();
    makeBtn();
  });
  liftTopBar();
  makeBtn();
})();
