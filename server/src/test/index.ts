import { config as env } from 'dotenv';
import { createServer } from 'http';

import axios from 'axios';
// import { expect } from 'chai';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

import app from '../';
import * as entities from '../entity';
import dummyData from '../static/dummyData';
import person from './person';
import orgTest from './org';
import advertTest from './advert';
import applicationTest from './application';
import { convert } from './utils';

env();

// Timeout before mocha does
axios.defaults.timeout = 1000;
// Do not throw on 300<= status codes
axios.defaults.validateStatus = function (status) { return true; }

// TODO: move interface definitions to a separate module
interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

const server = createServer(app);
let db: Connection;
// TODO: use separate DB for test by declaring multiple profiles in ormconfig.js

// TODO: run only specific test(s) provided as arguments
describe('Obbli API server', function () {

  before(async function () {
    const config = await getConnectionOptions();
    Object.assign(config, {
      dropSchema: true,
      synchronize: true,
      entities: Object.values(entities),
    });

    // TODO: manage duplicate lines (e.g. try-catch blocks)
    try {
      db = await createConnection(config);
    } catch(e) {
      console.log('ERROR: DB connection failed. Terminating tests.');
      console.log(e);
      process.exit(1);
    }

    // TODO: prepare standalone seeding function in `seed` module
    try {
      for (let entity in dummyData) {
        const data = convert(dummyData[entity]);
        await db.createQueryBuilder()
          .insert()
          .into(entity)
          .values(data)
          .execute();
      }
    } catch(e) {
      console.log('ERROR: DB seeding failed. Terminating tests.');
      console.log(e);
      process.exit(1);
    }

    server.listen(0, '127.0.0.1');
    server.once('listening', () => {
      const info = server.address() as AddressInfo;
      axios.defaults.baseURL = `http://127.0.0.1:${info.port}`;
    });
  });

  person(server);
  orgTest(server);
  advertTest(server);
  applicationTest(server);

  after(function () {
    db.close().then(() => console.log('DB connection closed'));
    server.close(() => console.log('Server closed'));
  });

});
