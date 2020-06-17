const routes = require('express').Router();
const path = require('path');
const textSentiments = require('./textSentiment');

routes.get('/1', async (req, res) => {
    let result = await textSentiments.getCode();
    res.json(result);
});

routes.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


module.exports = routes;