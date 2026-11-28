/* moemn farmr - install helper: native install prompt when available, APK download otherwise */
(function () {
  var APK = 'https://moemnquiz.github.io/1-moemn-farmr.apk';
  var deferred = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
  });
  window.addEventListener('appinstalled', function () { deferred = null; });

  function isStandalone() {
    try {
      return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    } catch (e) { return false; }
  }

  function openApkSheet() {
    var ov = document.getElementById('sheetOv');
    var sh = document.getElementById('sheet');
    if (!ov || !sh) return false;
    sh.innerHTML =
      '<div class="big">\u2b07\ufe0f</div>' +
      '<h2>\u062a\u0646\u0632\u064a\u0644 \u0627\u0644\u0644\u0639\u0628\u0629 \u0643\u062a\u0637\u0628\u064a\u0642</h2>' +
      '<p>\u062f\u0648\u0633 \u0627\u0644\u0632\u0631\u0627\u0631 \u0627\u0644\u0623\u062e\u0636\u0631 \u0648\u0647\u064a\u062a\u0646\u0632\u0644 \u0645\u0644\u0641 \u0627\u0644\u062a\u0637\u0628\u064a\u0642\u060c \u0648\u0628\u0639\u062f\u064a\u0646 \u062f\u0648\u0633 \u00ab\u062a\u062b\u0628\u064a\u062a\u00bb.</p>' +
      '<a class="ok" style="display:inline-block;text-decoration:none;background:linear-gradient(#7ec850,#3d8a1e);color:#fff;border:2px solid #2d6a1e;border-radius:14px;padding:12px 30px;font-weight:800" href="' + APK + '">\u2b07\ufe0f \u0646\u0632\u0651\u0644 \u0627\u0644\u062a\u0637\u0628\u064a\u0642</a>' +
      '<p style="font-size:14px;opacity:.85">\u0623\u0648 \u0645\u0646 \u0643\u0631\u0648\u0645: \u0627\u0644\u0646\u0642\u0637 \u22ee \u0641\u0648\u0642 \u2190 \u00ab\u062a\u062b\u0628\u064a\u062a \u0627\u0644\u062a\u0637\u0628\u064a\u0642\u00bb.</p>' +
      '<button class="ok" style="background:linear-gradient(#ffd54a,#ff9d2e);color:#4a2f10;border:2px solid #8a5a2e">\u062a\u0645\u0627\u0645 \ud83d\udc4d</button>';
    ov.classList.add('on');
    return true;
  }

  function wire() {
    var old = document.getElementById('installBtn');
    if (!old || isStandalone()) return;
    var btn = old.cloneNode(true);
    old.parentNode.replaceChild(btn, old);
    btn.addEventListener('pointerdown', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (deferred) {
        var d = deferred;
        deferred = null;
        try { d.prompt(); } catch (err) { openApkSheet(); }
        return;
      }
      if (!openApkSheet()) window.location.href = APK;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
