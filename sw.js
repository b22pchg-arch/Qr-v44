// Nhật ký cập nhật AirGap SCADA: Tích hợp nút check thủ công - Ngày 19/05/202616h41
const CACHE_NAME = 'AirGapSCADA-Static-Cache'; 
const ASSETS = [
  '',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Cài đặt và cưỡng bách tải tài nguyên mới bỏ qua HTTP Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // 🚀 BẺ GÃY BẪY HTTP CACHE: Ép điện thoại phi thẳng lên Server lấy file mới tinh
            const refreshRequests = ASSETS.map(asset => new Request(asset, { cache: 'reload' }));
            return cache.addAll(refreshRequests);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

// Chiến lược Offline tối thượng: Trả dữ liệu từ Cache lập tức trong 0.01 giây
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request);
        })
    );
});
