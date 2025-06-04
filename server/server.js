require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path')

const apiRout = require('./routes/api.rout');

const corsOptions = {
  origin: ['*'],
  credentials: true,
};




const app = express();
const PORT = process.env.PORT || 3001;

const sessionConfig = {
  name: 'cookieName', 
  store: new FileStore(),
  secret: process.env.SESSION_SECRET, 
  resave: true, 
  saveUninitialized: false, 
  cookie: {
    maxAge: 24 * 1000 * 60 * 60, 
    httpOnly: true, 
  },
};

app.use(cors({ credentials: true, origin: true }));
app.use(cors(corsOptions));
app.use(session(sessionConfig))
app.use(morgan('dev'));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));


app.use('/', apiRout)


app.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));
