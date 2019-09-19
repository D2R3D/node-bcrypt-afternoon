require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
// Controllers
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController')
const auth = require ('./controllers/middleware/authMiddleware')

const PORT = 4000;

const { SESSION_SECRET, CONNECTION_STRING } = process.env;

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  console.log('roger roger');
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 60000
    } 
  })
);

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)

app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));