const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const emotes = require(__dirname + '/frontend/emotes.json');

const randomInt = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
};

class Server {
  constructor() {
    this.app = express();
    this.init();
  }

  async init() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(express.static(__dirname + '/frontend'));

    this.initEnv();
    this.initRouting();
    this.createServer();
    this.initSockets();
  }

  initEnv() {
    try {
      process.env.NODE_ENV = process.env.NODE_ENV? process.env.NODE_ENV : 'dev';
      console.log('Init env:', process.env.NODE_ENV);

    } catch (err) {
      console.log("Error when initialized env", {err});
      process.exit();
    }
  }

  initRouting() {
    try {
      this.app.get('/get_song', (req, res) => {
        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-Length': this.song.stat.size
        });

        fs.createReadStream(`${__dirname}/data/${this.song.full}`).pipe(res);
      });
    } catch (err) {
      console.log('Error when init routes', err);
      process.exit();
    }
  }

  generateSong() {
    const dir = fs.readdirSync(__dirname + '/data');
    const id = randomInt(0, dir.length - 1);
    const temp = dir[id].split('.mp3')[0];
    this.song = {
      full: dir[id],
      author: temp.split('-')[0],
      name: temp.split('-')[1],
    };
    this.song.stat = fs.statSync(`${__dirname}/data/${this.song.full}`);
    console.log('song randomed:', temp);
  }

  initSockets() {
    this.gameFindUsers = [];

    this.io = require('socket.io')(this.server);

    this.io.on('connection', (socket) => {
      console.log('user connected');

      socket.on('disconnect', () => {
        const index = this.gameFindUsers.findIndex(obj => obj.id === socket.id);
          if (index !== -1 )
            this.gameFindUsers.splice(index, 1);
      });

      socket.on('game_search', (userName) => {
        if (socket.userName || !userName)
          return;

        console.log('game_search', userName);
        socket.userName = userName;
        this.gameFindUsers.push({id: socket.id, userName: socket.userName});

        if(this.gameFindUsers.length > 1) {
          const sockets = this.io.of('/').connected;
          for (let obj of this.gameFindUsers) {
            if(sockets[obj.id]) {
              sockets[obj.id].join('game_room');
            }
          }
          this.generateSong();
          this.io.to('game_room').emit('game_started', this.gameFindUsers);
          this.gameFindUsers = [];
        }
      });

      socket.on('send_message', (text) => {
        text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        for (let key in emotes) {
            const regexp = new RegExp(emotes[key].code, "g");
            const img = `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${emotes[key].id}/1.0">`;
            text = text.replace(regexp, img)
        }
        if (text.indexOf(this.song.author) !== -1 || text.indexOf(this.song.name) !== -1) {
          this.generateSong();
          this.io.to('game_room').emit('win_game', {userName: socket.userName, text});
        }
        else
          this.io.to('game_room').emit('new_message', {userName: socket.userName, text});
      })
    });
  }

  createServer() {
    const port = process.env.PORT || 8080;
    this.server = http.createServer(this.app);
    this.server.listen(port, () => {
      console.log(`Start listening on localhost:${port}`)
    });
  }
}

module.exports = new Server;