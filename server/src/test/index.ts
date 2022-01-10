import { config as env } from 'dotenv';
import { createServer } from 'http';

import axios from 'axios';
// import { expect } from 'chai';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

import app from '../';
import * as entities from '../entity';
import dummyData from '../static/dummyData';
import person from './person';

env();

// TODO: move interface definitions to a separate module
interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

// TODO: move utility functions to utils module
function convert(entity) {
  return entity.rows.map((item) => {
    return Object.fromEntries(item.map((v, i) => [entity.columns[i], v]));
  });
}

const server = createServer(app);
let db: Connection;
// TODO: use separate DB for test by declaring multiple profiles in ormconfig.js

// TODO: run only specific test(s) provided as arguments
describe('Obbli API server', () => {

  before(async () => {
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

  after(async () => {
    server.close();
    await db.close();
  });

});
