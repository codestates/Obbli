import axios from 'axios';
import { expect } from 'chai';

import { Person } from '../entity';
import dummyData from '../static/dummyData';
import {
  convert,
  genAuthHeader,
  re,
  request,
  requestWithInvalidToken,
} from './utils';
import { signToken } from '../Util';

const newUser = {
  user_id: 'tester',
  pw: 'password',
  name: 'testuser',
};
const dummyPerson = convert(dummyData.Person)[0];
const fakePerson = {
  uuid: 'not even a uuid',
  user_id: 'ghost',
  pw: 'password',
  created_at: 'invalid data' as unknown as Date,
};
const authHeader = genAuthHeader(dummyPerson);
const fakeAuthHeader = genAuthHeader(fakePerson);

export default (server) => {

  describe('Person membership API', () => {

    describe('GET /person', function () {
      it('Get person profile', async function() {
        const { data, status } = await axios.get('/person', authHeader);
        expect(status).to.equal(200);
        expect(data).to.have.keys(['realname', 'professional', 'skill', 'history']);
      });

      it('Access without token', async function() {
        await request(axios.get, '/person', 500);
      });

      it('Access with invalid token', async () => {
        await requestWithInvalidToken(axios.get, '/person', 401);
      });

      it('Access to non-existent user', async () => {
        await request(axios.get, '/person', 404, fakeAuthHeader)
      });
    });

    describe('POST /person', () => {
      it('Sign up', async () => {
        const { data, status } = await axios.post('/person', { ...newUser, pw_check: newUser.pw });
        expect(status).to.equal(201);
        expect(data).to.have.property('access_token').and.match(re.token);

        const row = await Person.findOne({ user_id: newUser.user_id });
        expect(row).to.be.an.instanceof(Person);
        expect(row.realname).to.equal(newUser.name);
      });

      it('Invalid payload', async () => {
        for (const key in newUser) {
          const body = { ...newUser };
          delete body[key];
          await request(axios.post, '/person', 400, { ...body, pw_check: newUser.pw });
        }
        await request(axios.post, '/person', 400, { ...newUser });
      });

      it('Duplicate ID', async () => {
        const { user_id, realname: name, pw_hash: pw, pw_hash: pw_check } = dummyPerson;
        await request(axios.post, '/person', 403, { user_id, name, pw, pw_check });
      });
    });

    describe('POST /person/sign-in', function () {
      it('Sign in', async () => {
        // TODO: what if extra properties are in payload?
        const { user_id, pw_hash: pw } = dummyPerson;
        const { data, status } = await axios.post('/person/sign-in', { user_id, pw });
        expect(status).to.equal(200);
        expect(data).to.have.property('access_token').and.match(re.token);
      });

      it('Invalid payload', async function () {
        // empty payload
        expect((await axios.post('/person/sign-in', {})).status).to.equal(400);
        // missing user_id or pw
        const { user_id, pw_hash: pw } = dummyPerson;
        for (const [k, v] of Object.entries({ user_id, pw })) {
          await request(axios.post, '/person/sign-in', 400, { [k]: v });
        }
      });

      it('No matching user', async function () {
        const { user_id, pw } = fakePerson;
        await request(axios.post, '/person/sign-in', 400, { user_id, pw });
      });
    });

    describe('PATCH /person', function () {
      const newProfile = { name: 'updatedName', skill: '플룻' };

      it('Update profile', async function () {
        const { data, status } = await axios.patch('/person', newProfile, authHeader);

        expect(status).to.equal(200);
        expect(data).to.have.keys(['name', 'professional', 'skill', 'history']);
        for (const key in newProfile) {
          expect(data[key]).to.equal(newProfile[key]);
        }
        // TODO: check type of each property
      });

      it('Access without token', async function () {
        await request(axios.patch, '/person', 401, newProfile);
      });
      it('Access with invalid token', async function () {
        await requestWithInvalidToken(axios.patch, '/person', 401, newProfile, {});
      });
      it('invalid payload', async function () {
        await request(axios.patch, '/person', 401, { user_id: 'cannotBeChanged' }, authHeader);
      });
    });

    describe('DELETE /person', function () {
      it('Unregister', async () => {
        const { status } = await axios.delete('/person', authHeader);

        expect(status).to.equal(204);
        // TODO: check if data is deleted from DB
      });

      it('Access without token', async function () {
        await request(axios.delete, '/person', 401);
      });

      it('Access with invalide token', async function () {
        await requestWithInvalidToken(axios.delete, '/person', 401);
      });

      it('No matching user', async function () {
        await request(axios.delete, '/person', 404, fakeAuthHeader);
      });
    });

  });
}
