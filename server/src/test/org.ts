import axios from 'axios';
import { expect } from 'chai';

import { Org } from '../entity';
import dummyData from '../static/dummyData';
import {
  convert,
  genAuthHeader,
  re,
  request,
  requestWithInvalidToken,
} from './utils';

const newOrg = {
  user_id: 'testerOrg',
  pw: 'password',
  name: 'testOrg',
};

const updatedOrg = {
  name: 'updatedOrg',
}

const dummyOrg = convert(dummyData.Org)[0];
const fakeOrg = {
  uuid: 'not even a uuid',
  user_id: 'ghost',
  pw: 'password',
  created_at: 'invalid data' as unknown as Date,
};
const authHeader = genAuthHeader(dummyOrg);
const fakeAuthHeader = genAuthHeader(fakeOrg);

export default function (server) {

  describe('Organization membership API', function () {

    describe('GET /org', function () {
      it('Get org profile', async function () {
        const { data, status } = await axios.get('/org', authHeader);

        expect(status).to.equal(200);
        expect(data).to.have.keys(['description', 'headcount', 'name', 'since']);
        for (const key in data) {
          const source = dummyOrg[key];
          expect(data[key]).to.equal(source instanceof Date ? source.toISOString() : source);
        }
      });

      it('Access without token', async function() {
        await request(axios.get, '/org', 401);
      });
      it('Access with invalid token', async function() {
        await requestWithInvalidToken(axios.get, '/org', 401);
      });
      it('no matching user', async function() {
        await request(axios.get, '/org', 404, fakeAuthHeader);
      });
    })

    describe('POST /org', function() {
      it('Sign up', async function () {
        const { data, status } = await axios.post('/org', { ...newOrg, pw_check: newOrg });
        expect(status).to.equal(201);
        expect(data).to.have.property('access_token');

        const row = await Org.findOne({ user_id: newOrg.user_id });
        expect(row).to.be.an.instanceof(Org);
        expect(row.name).to.equal(newOrg.name);
      });

      it('Invalid payload', async function () {
        for (const key in newOrg) {
          const body = { ...newOrg };
          delete body[key];
          await request(axios.post, '/org', 400, { ...body, pw_check: newOrg.pw });
        }
        await request(axios.post, '/org', 400, { ...newOrg });
      });

      it('Duplicate ID', async function () {
        const { user_id, name, pw_hash: pw, pw_hash: pw_check } = dummyOrg;
        await request(axios.post, '/org', 403, { user_id, name, pw, pw_check });
      });
    });

    describe('POST /org/sign-in', function () {
      it('Sign in', async function () {
        const { user_id, pw_hash: pw } = dummyOrg;

        const { data, status } = await axios.post('/org/sign-in', { user_id, pw });
        expect(status).to.equal(200);
        expect(data).to.have.property('access_token');
      });

      it('Invalid payload', async function () {
        // empty payload
        expect((await axios.post('/org/sign-in', {})).status).to.equal(400);
        // missing user_id or pw
        const { user_id, pw_hash: pw } = dummyOrg;
        for (const [k, v] of Object.entries({ user_id, pw })) {
          await request(axios.post, '/org/sign-in', 400, { [k]: v });
        }
      });

      it('No matching user', async function () {
        const { user_id, pw } = fakeOrg;
        await request(axios.post, '/org/sign-in', 400, { user_id, pw });
      });

    });

    describe('PATCH /org', function () {
      it('Update profile', async function () {
        const { data, status } = await axios.patch('/org', updatedOrg, authHeader);

        expect(status).to.equal(200);
        for (const key in updatedOrg) {
          expect(data[key]).to.equal(updatedOrg[key]);
        }
      });

      it('Access without token', async function () {
        await request(axios.patch, '/org', 401, updatedOrg);
      });

      it('Access with invalid token', async function () {
        await requestWithInvalidToken(axios.patch, '/org', 401, updatedOrg, {});
      });

      it('invalid payload', async function () {
        await request(axios.patch, '/org', 401, { user_id: 'cannotBeChanged' }, authHeader);
      });
    });

    describe('DELETE /org', function () {
      it('Unregister', async function () {
        const { status } = await axios.delete('/org', authHeader);

        expect(status).to.equal(204);
      });

      it('Access without token', async function () {
        await request(axios.delete, '/org', 401);
      });

      it('Access with invalide token', async function () {
        await requestWithInvalidToken(axios.delete, '/org', 401);
      });

      it('No matching user', async function () {
        await request(axios.delete, '/org', 404, fakeAuthHeader);
      });
    });

  });

}
