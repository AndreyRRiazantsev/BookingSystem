export default class NotificationService {
  constructor(userId) {
    this.userId = userId;
    this.notificationsSupported = false;
    this.notificationsEnabled = false;
    this.serviceWorkerRegistation = null;
    this.subscription = null;

    if ('Notification' in window && 'serviceWorker' in navigator) {
      this.notificationsSupported = true
    }
  }

  async init() {
    if (this.notificationsSupported) {
      await this.findSubscription()
        .then(sub => {
          if (sub === null) {
            console.log('no active subscription found on the client', sub);
            this.notificationsEnabled = false
          } else {
            console.log('Active subscription found', sub);
            this.notificationsEnabled = true
            this.subscription = sub
          }
        });
    } else {
      console.error('Notifications not supported');
    }
  }

  askPermission() {
    if (this.notificationsSupported) {
      if (!this.notificationsEnabled) {
        Notification.requestPermission()
          .then(result => {
            if (result === 'granted') {
              !localStorage.setItem('push-notifications', true);

              this.createSubscription()
                .then(sub => {
                  console.info('subscription created on the client', sub);
                  this.subscription = sub

                  const SERVER_URL = `${process.env.PUSH_NOTIF_SERVER_URL}?userid=${this.userId}`;

                  return fetch(
                    SERVER_URL,
                    {
                      method: 'POST',
                      body: JSON.stringify(sub)
                    }
                  );
                })
                .then(res => {
                  console.log('Subscribed', res);
                  this.notificationsEnabled = true
                });
            } else {
              console.warn('User did not granted permission')
            }
          })
      } else {
        // Destroy subscription
        // console.log('Disable subscription');
        // if (this.subscription !== null) {
        //   // destroy on the server
        //   return axios.post(`${process.env.VUE_APP_API_PATH}/subscription/delete`, {
        //     endpoint: this.subscription.endpoint,
        //   })
        //     // unsubscribe on the client
        //     .then(() => this.subscription.unsubscribe())
        //     .then(() => {
        //       // update the data
        //       this.notificationsEnabled = false
        //       this.subscription = null
        //     })
        // }
      }
    } else {
      console.error('Notifications not supported');
    }
  }

  createSubscription() {
    console.log('ask for active service worker registration');
    if (this.serviceWorkerRegistation === null) {
      return navigator.serviceWorker.ready
        .then(swreg => {
          this.serviceWorkerRegistation = swreg
          return this.subscribe(this.serviceWorkerRegistation)
        })
    } else {
      return this.subscribe(this.serviceWorkerRegistation)
    }
  }

  getSubscription(swreg) {
    console.log('ask for available subscription');
    return swreg.pushManager.getSubscription()
  }

  subscribe(swreg) {
    console.log('create new subscription for this browser on this device');
    const convertedVapidPublicKey = this.urlBase64ToUint8Array(process.env.PUSH_NOTIF_PUBLIC_KEY)
    return swreg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidPublicKey
    })
  }

  findSubscription() {
    console.log('get active service worker registration');
    return navigator.serviceWorker.ready
      .then(swreg => {
        console.log('haal active subscription op');
        this.serviceWorkerRegistation = swreg
        return this.getSubscription(this.serviceWorkerRegistation)
      })
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
