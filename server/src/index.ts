import cors from 'cors';
import express from "express";
import indexRouter from './router'
import morgan from 'morgan'
import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import {Advert,Application,Org,Org_review,Person,Person_review,Position,Skill } from "./entity";
import dotenv from 'dotenv';

import { cookieParser } from './Util';
import * as Auth from './controllers/Auth';
import skillController from './controllers/Skill';
import {upload,uploadImage} from './Util';

dotenv.config();
const app = express();
const port = process.env.APP_PORT;

if (!module.parent) { app.use(morgan('dev')); }

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  allowedHeaders: ['Authorization', 'Content-Type'],
  origin: process.env.APP_DOMAIN,
  credentials: true,
  preflightContinue: false,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(cookieParser);

app.use("/person", indexRouter.Person);
app.use("/org", indexRouter.Org);
app.use("/advert", indexRouter.Advert);
app.use("/application", indexRouter.Application);
app.post('/auth', Auth.refreshToken);
app.post('/sign-out', Auth.signOut);
app.get('/skill', skillController);
app.post('/image', upload.single('image'),uploadImage)
// TODO: move routing configs to router/index.ts

export default app;

if (!module.parent) {
  getConnectionOptions().then((config) => {
    Object.assign(config, {
      entities: [Skill,Person,Org,Advert,Position,Application,Org_review,Person_review,],
    });
    return createConnection().catch(e => {
      console.log('DB connection failed. Terminating process.');
      process.exit(1);
    });
  }).then(conn => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
}
