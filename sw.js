import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';

setupRouting();
setupPrecaching(getFiles());

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = { body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'ATC Manager 2';
  const options = {
    ...data,
    badge: 'assets/images/meta-icons/mstile-144x144.png',
    icon: 'assets/images/image_src.png'
  };
  delete options.title;

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl =
    event.notification.data && event.notification.data.url
      ? event.notification.data.url
      : './';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(windows => {
        const existingWindow = windows.find(windowClient =>
          windowClient.url.startsWith(self.registration.scope)
        );

        if (existingWindow) {
          existingWindow.navigate(targetUrl);
          return existingWindow.focus();
        }

        return self.clients.openWindow(targetUrl);
      })
  );
});
