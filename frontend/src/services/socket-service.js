import io from 'socket.io-client';
const port = 8443;
// const SOCKET_URL = (process.env.NODE_ENV === 'development')? `http://127.0.0.1:${port}` : '';
const SOCKET_URL = '';

const socket = {
    install(Vue, store, router) {
        const socket = io(SOCKET_URL, {autoConnect: false});
        Vue.prototype.$socket = socket;

        socket.on('rooms', data => {
            store.commit('rooms', data)
        });

        socket.on('currentGame', data => {
            store.commit('currentGame', data);
            router.push(`/game${data.ID}`);
        });
    }
};

export default socket;