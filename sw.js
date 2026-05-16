const CACHE_NAME = 'airgap-scada-v40';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Cài đặt và kích hoạt chế độ lưu trữ Offline tài nguyên cốt lõi
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Thu hồi bộ nhớ đệm cũ khi có phiên bản V40.0 nâng cấp mới
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Chiến lược phản hồi ưu tiên mạng (Network-First), nếu mất mạng thì lấy dữ liệu lưu kho Offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});