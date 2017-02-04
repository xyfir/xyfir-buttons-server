require('app-module-path').addPath(__dirname);

const express =  require('express');
const session = require('express-session');
const parser = require('body-parser');
const moment = require('moment');

const store = require('express-mysql-session');
const app = express();

const config = require('config');

app.listen(config.environment.port, () => {
  console.log('~~Server running on port', config.environment.port);
});

app.use(session({
  secret: config.keys.session,
  store: new store(Object.assign(
    { useConnectionPooling: true }, config.database.mysql
  )),
  saveUninitialized: true,
  resave: true,
  cookie: { httpOnly: false }
}));

/* Body Parser */
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

// Express middleware / controllers
app.use('/api', require('./controllers/'));
app.get('/*', (req, res) => {
  if (config.environment.type == 'dev') {
    req.session.uid = 1,
    req.session.subscription = moment().add(1, 'days').unix();
  }
  res.sendFile(__dirname + '/views/Home.html');
});