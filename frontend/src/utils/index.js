const setCookie = (name, value, options) => {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    for (let i=0; i<name.length; i++) {
        value[i] = encodeURIComponent(value[i]);

        var updatedCookie = name[i] + "=" + value[i];

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }
};

const parseLocationParams = () => {
    const vkProps = {};
    const tmp = window.location.search.split('&');
    for (let key of tmp) {
        const prop = key.split('=');
        vkProps[prop[0]] = prop[1]
    }
    setCookie(['auth_key', 'uid'], [vkProps['auth_key'], vkProps['viewer_id']])
};

const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const splited = cookie.split('=');
        if (splited[0].trim() === name)
            return splited[1]
    }

};

export default  {
    setCookie,
    getCookie,
    parseLocationParams,

};