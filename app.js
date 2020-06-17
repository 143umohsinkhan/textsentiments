const express = require('express')
const app = express();
const routes = require('./router/router')
const bodyParser = require('body-parser')
require('dotenv').config()
const cluster = require('cluster');
const os = require('os');
const cpuCount = os.cpus().length;

// parse application/json
app.use(bodyParser.json());

//PORT 
const PORT = 80
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/', routes)
app.use(express.static(__dirname + '/static'));

// check if the process is the master process
if (cluster.isMaster) {
    // print the number of CPUs
    console.log(`Total CPUs are: ${cpuCount}`);

    for (let i = 0; i < cpuCount; i += 1) cluster.fork();

    // when a new worker is started
    cluster.on('online', worker => console.log(`Worker started with Worker Id: ${worker.id} having Process Id: ${worker.process.pid}`));

    // when the worker exits
    cluster.on('exit', worker => {
        // log
        console.log(`Worker with Worker Id: ${worker.id} having Process Id: ${worker.process.pid} went offline`);
        // let's fork another worker
        cluster.fork();
    });
} else {
    //Starting server on port
    app.listen(PORT, () => console.log('Server is up and running now ...'))
}
