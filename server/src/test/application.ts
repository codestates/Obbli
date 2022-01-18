import axios from 'axios';
import { expect } from 'chai';

import { Application } from '../entity';
import dummyData from '../static/dummyData';
import {
  convert,
  genAuthHeader,
  re,
  request,
  requestWithInvalidToken,
} from './utils';

const dummyPerson = convert(dummyData.Person)[0];
const dummyAdvert = convert(dummyData.Advert)[0];
const dummyOrg = convert(dummyData.Org).find(obj => obj.uuid === dummyAdvert.org_uuid);
const dummyPosition = convert(dummyData.Position).find(obj => obj.advert_uuid === dummyAdvert.uuid);
const fakeUser = {
  uuid: 'not even a uuid',
  user_id: 'ghost',
  pw: 'password',
  created_at: 'invalid data' as unknown as Date,
};

const personAuthHeader = genAuthHeader(dummyPerson);
const orgAuthHeader = genAuthHeader(dummyOrg);
const fakeAuthHeader = genAuthHeader(fakeUser);

export default (server) => {
  describe('Application API', () => {

    describe('GET /application', function () {
      it('Get a list of applications made by a person', async function () {
        const { data, status } = await axios.get(`/person/application`, personAuthHeader);

        expect(status).to.equal(200);
        expect(data).to.be.an('array');
        for (const obj of data) {
          expect(obj).to.be.an('object');
          expect(obj).to.have.keys([
            'org_uuid',
            'org_name',
            'skill_name',
            'created_at',
            'received_at',
            'hired_at',
          ]);
        }
      });

      it('Access without token', async function() {
        await request(axios.get, '/person/application', 401);
      });
      it('Access with invalid token', async function() {
        await requestWithInvalidToken(axios.get, '/person/application', 401);
      });
      it('no matching user', async function() {
        await request(axios.get, '/person/application', 404, fakeAuthHeader);
      });
    });

    describe('GET /advert/:advert_uuid/application', function () {
      it('Get a list of applications made to an advert', async () => {
        const { data, status } = await axios.get(
          `/advert/${dummyAdvert.uuid}/application`,
          orgAuthHeader
        );

        expect(status).to.equal(200);
        expect(data).to.be.an('array');
        for (const skill of data) {
          expect(skill).to.be.an('object');
          expect(skill).to.have.keys([
            'position_uuid',
            'skill_name',
            'person',
          ]);
          expect(skill.person).to.be.an('array');
          for (const person of skill.person) {
            expect(person).to.be.an('object');
            expect(person).to.have.keys(['uuid', 'name', 'professional']);
          }
        }
      });

      it('Access without token', async function() {
        await request(axios.get, `/advert/${dummyAdvert.uuid}/application`, 401);
      });
      it('Access with invalid token', async function() {
        await requestWithInvalidToken(axios.get, `/advert/${dummyAdvert.uuid}/application`, 401);
      });
      it('no matching advert', async function() {
        await request(axios.get, '/advert/no_advert/application', 404, orgAuthHeader);
      });
    });

    describe('PATCH /application', function () {
      const body = {
        person_uuid: dummyPerson.uuid,
        position_uuid: dummyPosition.uuid,
        state: 'received',
      };

      it('Update application state', async function () {
        const { person_uuid, position_uuid } = body;
        for (const state of ['received', 'hired']) {
          const { status } = await axios.patch(
            `/application`,
            { ...body, state },
            orgAuthHeader,
          );
          const row = Application.findOne({ person_uuid, position_uuid });
          expect(row).to.be.an.instanceof(Application);
          expect(row[`${state}_at`]).not.to.be.null;
        }
      });

      it('Access without token', async function() {
        await request(axios.patch, `/application`, 401, body);
      });
      it('Access with invalid token', async function() {
        await requestWithInvalidToken(axios.patch, `/application`, 401, body, {});
      });
      it('Unauthorized access', async function() {
        await request(axios.patch, `/application`, 401, body, fakeAuthHeader);
      });
    });

    describe('POST /application/:position_uuid', function () {
      it('Make an application to an advert', async function () {
        const { data, status } = await axios.post(
          `/application/${dummyPosition.uuid}`,
          {},
          personAuthHeader
        );

        expect(status).to.equal(201);
        expect(data).to.have.key('created_at');
      });

      it('Access without token', async function() {
        await request(axios.post, `/application/${dummyPosition.uuid}`, 401, {});
      });
      it('Access with invalid token', async function() {
        await requestWithInvalidToken(axios.post, `/application/${dummyPosition.uuid}`, 401, {}, {});
      });
      it('no matching user', async function() {
        await request(axios.post, `/application/${dummyPosition.uuid}`, 404, orgAuthHeader, {}, fakeAuthHeader);
      });
      it('no matching advert', async function() {
        await request(axios.post, `/application/no_advert`, 404, orgAuthHeader, {}, personAuthHeader);
      });
    });

  });
}
