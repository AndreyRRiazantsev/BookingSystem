self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

'use strict';

var CACHE_NAME = "global_c123";

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}
function clearCache() {
  //	self.registration.showNotification("deleting", {body: "clearing cache"});
  caches.delete(CACHE_NAME);
}

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');

  var data = {};
  if (event.data) {
    data = event.data.json();
  }
  var title = data.title || "Gupshup Message";
  var message = data.message || "You have a new message";
  var icon = data.iconurl || "images/icon.png";

  const options = {
    body: message,
    icon: icon,
    data: data,
    tag: data.brandid
  };


  if (!data.alreadyOpen) {
    event.waitUntil(
      self.registration.getNotifications().then(function (notifications) {
        notifications.forEach(function (notification) {
          console.log("notification.tag = " + notification.tag);
          if (notification.tag == options.tag) {
            options.data.msgCount = (notification.data.msgCount || 1) + 1;

            if (options.data.msgCount > 1) {
              options.body = "You have " + options.data.msgCount + " new messages";
            }
          }
        });

        self.registration.showNotification(title, options);
      }));
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

self.addEventListener('install', function (event) {
  console.log("installed!!!!");
  self.skipWaiting();
  clearCache();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            return response;
          }
        );
      })
  );
});
