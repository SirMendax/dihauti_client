// Caches
var CURRENT_CACHES = {
    font: 'font-cache-v1',
    css:'css-cache-v1',
    js:'js-cache-v1',
    icons: 'icons-cache-v1',
    icons_ext: 'icons_ext-cache-v1',
    image: 'image-cache-v1'
};

self.addEventListener('install', (event) => {
	self.skipWaiting();
    console.log('Service Worker has been installed');
});


self.addEventListener('activate', (event) => {
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
        return CURRENT_CACHES[key];
    });
    // Delete out of date cahes
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) == -1) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    console.log('Service Worker has been activated');
});


self.addEventListener('fetch', function(event) {
	console.log('Fetching:', event.request.url);

	event.respondWith(async function() {
		const cachedResponse = await caches.match(event.request);
		if (cachedResponse) {
			// console.log("Cached version found: " + event.request.url);
			var l = new URL(event.request.url);
			if (updated[l.pathname] === undefined || updated[l.pathname] == cachedResponse.headers.get("Last-Modified")) {
				// console.log("Returning from cache");
				return cachedResponse;
			}
			console.log("Updating to recent version");
		}
		return await fetchAndCache(event.request);
	}());

});


function fetchAndCache(url) {
	return fetch(url)
	.then(function(response) {
		// Check if we received a valid response
		if (!response.ok) {
			return response;
			// throw Error(response.statusText);
		}

		// console.log('  Response for %s from network is: %O', url.url, response);
		if (response.status < 400 &&
			response.type === 'basic' &&
			response.headers.has('content-type')) {
			// debugger;

			var cur_cache;
			if (response.headers.get('content-type').indexOf("application/javascript") >= 0) {
				cur_cache = CURRENT_CACHES.js;
			} else if (response.headers.get('content-type').indexOf("text/css") >= 0) {
				cur_cache = CURRENT_CACHES.css;
			} else if (response.headers.get('content-type').indexOf("font") >= 0) {
				cur_cache = CURRENT_CACHES.font;
			} else if (url.url.indexOf('/css/icons/') >= 0) {
				cur_cache = CURRENT_CACHES.icons;
			} else if (url.url.indexOf('/misc/image.php?') >= 0) {
				cur_cache = CURRENT_CACHES.image;
			}
			if (cur_cache) {
				console.log('  Caching the response to', url);
				return caches.open(cur_cache).then(function(cache) {
					cache.put(url, response.clone());
					updated[(new URL(url.url)).pathname] = response.headers.get("Last-Modified");
					return response;
				});
			}
		}
		return response;

	})
	.catch(function(error) {
		console.log('Request failed:', error);
		throw error;
		// You could return a custom offline 404 page here
	});
}
