import 'reflect-metadata';
import express from 'express';
import {createConnection} from 'typeorm';
import cookieParser from 'cookie-parser';
import path from 'path';
import next from 'next';
import session from 'express-session';

const SQLiteStore = require('connect-sqlite3')(session);

import {registerController} from '@express';

require('dotenv').config();

(async () => {
  const host = 'localhost';
  const port = parseInt(process.env.PORT || "3000", 10);
  const dev = process.env.APP_ENV === 'development'; // Tell next js to compile as dev or prod
  const app = next({ dev });
  const handle = app.getRequestHandler();

  await app.prepare();
  await createConnection();
  const server = express();
  
  server.use(express.json({ limit: '50mb' }));
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser());
  server.use(session({
    secret: 'a-very-secret-session-token',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
      maxAge: 7 * 24 * 60 * 60 * 1000
    },
    store: new SQLiteStore()
  }))
  server.use('/api', registerController(path.resolve(__dirname, 'controllers')));
  
  server.all('*', (req, res) => {
    return handle(req, res)
  });
  server.listen(port, () => {
    console.log(`> Ready on ${host}`);
  });
})();
