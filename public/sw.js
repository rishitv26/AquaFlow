/**
 * Service Worker for AquaPulse
 * Enables offline support and caching
 */

const CACHE_NAME = 'aquapulse-v1'
const RUNTIME_CACHE = 'aquapulse-runtime'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('[SW] Some static assets failed to cache (expected in dev)')
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip API calls - let them go through directly
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => new Response(JSON.stringify({ error: 'Offline' }), { status: 503 }))
    )
    return
  }

  // Network first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const cache = caches.open(RUNTIME_CACHE)
          cache.then((c) => c.put(request, response.clone()))
        }
        return response
      })
      .catch(() => {
        // Fall back to cache on network error
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || new Response('Offline - content not available', { status: 503 })
        })
      })
  )
})
