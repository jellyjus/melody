const https = require('https')
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/frontend/dist'));

const port = process.env.PORT || 443;
const credentials = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
const server = https.createServer(credentials, app);
server.listen(port, () => {
    console.log(`Start listening on localhost:${port}`)
});