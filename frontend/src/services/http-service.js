import axios from 'axios'
const port = 8443;
// const SERVER_URL = (process.env.NODE_ENV === 'development')? `http://127.0.0.1:${port}` : '';
const SERVER_URL = '';

const http = {
    install(Vue, options) {
        Vue.prototype.$http = {
            get(url, params) {
                let add = '';
                if (params) {
                    add += '?';
                    for (let key in params)
                        add += `${key}=${params[key]}&`
                    add = add.slice(0,-1);
                }
                return axios.get(SERVER_URL + url + add)
            },
            post(url, body) {
                return axios.post(SERVER_URL + url, body)
            }
        }
    }
};

export default http;