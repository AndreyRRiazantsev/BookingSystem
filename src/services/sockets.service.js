const AUTO_RECONNECT_INTERVAL = 1000;

export default class SocketsService {
  constructor(uri) {
    this.uri = uri;
    this.callbacks = [];
    this.onOpenCallback = [];
  }

  open() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.uri);
        this.socket.addEventListener('open', (e) => {
          console.info('Connected...');

          this.onOpenCallback?.forEach(fn => {
            try {
              fn();
            } catch (e) {
              console.error(e);
            }
          });

          resolve(e);
        });
      } catch (e) {
        reject(e);
      }

      this.socket.addEventListener('close', (e) => {
        switch (e.code) {
          case 1000:
            break;
          default:
            this.reconnect(e);
            break;
        }
        this.onclose(e);
      });

      this.socket.addEventListener('error', (e) => {
        switch (e.code) {
          case 'ECONNREFUSED':
            this.reconnect(e);
            break;
          default:
            this.onerror(e);
            break;
        }
      });

      this.socket.addEventListener('message', (e) => {
        this.callbacks?.forEach(fn => {
          console.info('GET:', e);
          try {
            fn(JSON.parse(e.data));
          } catch (e) {
            console.error(e);
          }
        });
      });
    });
  }

  sendJSON(json) {
    console.info('SEND:', json);
    this.socket.send(JSON.stringify(json));
  }

  onOpen(callback) {
    this.onOpenCallback.push(callback);
  }

  offOpen(callback) {
    const index = this.onOpenCallback.indexOf(callback);
    this.onOpenCallback.splice(index, 1);
  }

  onMessage(callback) {
    this.callbacks.push(callback);
  }

  offMessage(callback) {
    const index = this.callbacks.indexOf(callback);
    this.callbacks.splice(index, 1);
  }

  close(code) {
    if (!this.socket) return;

    this.socket.close(code);
    this.socket = null;
    clearTimeout(this.autoReconnectTimer);
  }

  onerror() {
    console.error('WebSocketClient: error', arguments);
  }

  onclose() {
    console.info('WebSocketClient: closed', arguments);
  }

  reconnect(e) {
    console.log(`WebSocketClient: retry in ${AUTO_RECONNECT_INTERVAL}ms`, e);
    this.close();
    this.autoReconnectTimer = setTimeout(() => {
      console.log('WebSocketClient: reconnecting...');
      this.open();
    }, AUTO_RECONNECT_INTERVAL);
  }
}
