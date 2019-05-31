const express = require('express');
const helmet = require('helmet');
const actionsRouter = require('./actions/actionsRouter');
const projectsRouter = require('./projects/projectsRouter');

const server = express();

server.use(
  express.json(),
  helmet(), 
  logger
  );

server.get('/', (req, res) => {
  res.send(`<h2>Sprint Challenge: Web API</h2>`)
});

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

//custom middleware


function logger(req, res, next) {
const currentTime = new Date();
const clockTime = "At: " + currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();

console.log(`A ${req.method} request to '${req.url}'`);
console.log(`${clockTime}`)
next();
};

module.exports = server;
