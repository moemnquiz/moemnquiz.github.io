/* moemn quiz - offline service worker */
var VERSION = 'mq-v3';
var SHELL = [
  '/',
  '/index.html',
  '/app.js',
  '/1-quiz20.js',
  '/app.css',
  '/manifest.webmanifest',
  '/10-icon-192.png',
  '/11-icon-512.png',
  '/stick-clash-app.html',
  '/stickclash.webmanifest',
  '/8-icon-game-192.png',
  '/9-icon-game-512.png',
  '/1-stick-clash-3d.html'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      return Promise.all(SHELL.map(function (u) {
        return c.add(new Request(u, { cache: 'no-cache' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== VERSION) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith((async function () {
    var cache = await caches.open(VERSION);
    try {
      var res = await fetch(req, { cache: 'no-cache' });
      if (res && res.status === 200 && res.type === 'basic') {
        cache.put(req, res.clone()).catch(function () {});
      }
      return res;
    } catch (err) {
      var hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
      if (hit) return hit;
      if (req.mode === 'navigate') {
        var idx = await cache.match('/index.html') || await cache.match('/');
        if (idx) return idx;
      }
      throw err;
    }
  })());
});
