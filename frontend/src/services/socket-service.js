import io from 'socket.io-client';
const port = 8443;
const SOCKET_URL = (process.env.NODE_ENV === 'development')? `http://127.0.0.1:${port}` : '';

const socket = {
    install(Vue, options) {
        Vue.prototype.$socket = io(SOCKET_URL)
    }
};

export default socket;