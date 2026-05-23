// sw.js — Service Worker de rescate para Puntos de Amor
// Objetivo: limpiar caches antiguas y dejar de interceptar la app.
// Sube este archivo a la RAÍZ del repositorio, reemplazando el sw.js anterior.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
