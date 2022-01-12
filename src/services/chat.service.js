import SocketsService from './sockets.service';
import UserService from './user.service';

export default class ChatService {
  constructor() {
    if (ChatService.instance) {
      return ChatService.instance;
    }

    this.interval = null;
    this.subscribers = [];
    this.sender = ChatService.config.sender.sender;
    this.sender.userAgent = UserService.userAgent

    console.log(`${process.env.SOCKET_BASE_URL}/${this.sender.id}_${ChatService.botKey}`);
    this.sockets = new SocketsService(
      `${process.env.SOCKET_BASE_URL}/${this.sender.id}_${ChatService.botKey}`
    );

    ChatService.instance = this;
  }

  static get config() {
    if (!this._config) {
      try {
        try {
          this._config = JSON.parse(window.atob(window.location?.search.split('=')[1]));
        } catch (e) {
          this._config = window.configData;
        }
        
      } catch (e) {
        console.error(e);
      }
    }
    console.log('THIS IS OBJECT',this._config)
    return this._config;
  }

  static get sender() {
    return ChatService.config.sender.sender;
  }

  
  static get botKey() {
    return ChatService.config.botkey;
  }
  
  setHeartbeatInterval() {
    this.interval = setInterval(() => {
      this.send({ text: "heartbeat", type: "custom" });
    }, 1000 * 30);
  }

  async init() {
    await this.sockets.open();
    this.setHeartbeatInterval();
  }

  onOpen(callback) {
    this.sockets.onOpen(callback);
  }

  onMessage(callback) {
    this.sockets.onMessage((data) => {
      if (data?.messages?.find(msg => msg.type === 'custom' && msg.message === 'ERR_CLOSE_CONNECTION')) {
        callback(data);
        this.closeReason = 'ERR_CLOSE_CONNECTION';
        this.close(1000);
      } else {
        this.closeReason = null;
        callback(data);
      }
    });
  }

  offMessage(callback) {
    this.sockets.offMessage(callback);
  }

  send(message) {
    clearInterval(this.interval);

    this.sockets.sendJSON({
      channel: "widget",
      sender: this.sender,
      recipient: { id: ChatService.botKey, name: "Bot" }, // TODO: need to clerify
      message,
      refid: uuid(),
      retrycount: 0,
    });

    this.setHeartbeatInterval();
  }

  close(code) {
    clearInterval(this.interval);
    this.sockets.close(code);
  }
}

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + s4();
}
