const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const io = require('socket.io');
const cookieParser = require('socket.io-cookie-parser');

const socketEvents = require('./routing/events');

class Server {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(express.static(__dirname + '/frontend/dist'));

        this.initEnv();
        this.initLog();
        this.createServer();
        this.initSockets();
    }

    initEnv() {
        process.env.NODE_ENV = process.env.NODE_ENV? process.env.NODE_ENV : 'dev';
        console.log('Init env:', process.env.NODE_ENV);
    }

    initLog() {
        try {
            const transports = process.env.NODE_ENV === 'dev'?
                [
                    new winston.transports.Console({})
                ] :
                [
                    new winston.transports.File({ filename: 'error.log', level: 'error'}),
                    new winston.transports.File({ filename: 'combined.log', })
                ];

            const format = winston.format.printf(info => {
                const date = new Date(info.timestamp);
                return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${info.level}: ${info.message}`;
            });

            this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), format),
            transports: transports
        });
        } catch (e) {
            console.log(`Can't init log:`, e);
            process.exit(1)
        }

    }

    initSockets() {
        this.io = io(this.server);
        this.io.use(cookieParser());
        const events = new socketEvents(this.io, this.logger);
        this.io.on('connection', events.initEvents.bind(events));
    }

    createServer() {
        const port = process.env.PORT || 443;
        const credentials = {
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem')
        };

        if (process.env.NODE_ENV === 'dev') {
            const http = require('http');
            this.server = http.createServer(this.app);
        } else {
            this.server = https.createServer(credentials, this.app);
        }

        this.server.listen(port, () => {
            this.logger.info(`Start listening on localhost:${port}`)
        });
    }
}

module.exports = new Server();