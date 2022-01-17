import axios from 'axios';
import { expect } from 'chai';

import dummyData from '../static/dummyData';
import {
  convert,
  genAuthHeader,
  request,
  requestWithInvalidToken,
} from './utils';

function isAdvertList(arr: Object[]): Boolean {
  const _map = {
    'uuid': false,
    'location': false,
    'org_name': false,
    'title': false,
    'active_until': false,
  }

  for (const obj of arr) {
    const map = { ..._map };
    for (const key in obj) {
      if (!map.hasOwnProperty(key)) { return false; }
      map[key] = true;
    }
    if (!Object.values(map).every(v => v)) { return false; }
  }

  return true;
}

const dummyAdvert = convert(dummyData.Advert)[0];
const dummyOrg = convert(dummyData.Org).find(row => row.uuid === dummyAdvert.org_uuid);
const fakeOrg = {
  uuid: 'not even a uuid',
  user_id: 'ghost',
  pw: 'password',
  created_at: 'invalid data' as unknown as Date,
};
const updatedAdvert = {
  body: 'Updated content',
};
const authHeader = genAuthHeader(dummyOrg);
const fakeAuthHeader = genAuthHeader(fakeOrg);

export default (server) => {
  describe('Advertisement API', () => {

    describe('GET /advert', function () {
      it('Get advert list', async function () {
        const { data, status } = await axios.get('/advert');

        expect(status).to.equal(200);
        expect(isAdvertList(data)).to.be.true;
      });
    });

    describe('GET /advert/:advert_uuid', function () {
      it('Get Advert content', async function () {
        const { data, status } = await axios.get(`/advert/${dummyAdvert.uuid}`);

        expect(status).to.equal(200);
        expect(data).to.have.keys([
          'active_until',
          'body',
          'event_at',
          'location',
          'org_name',
          'positions',
          'reviews',
          'title',
        ]);
      });

      it('No matching advert', async function () {
        await request(axios.get, '/advert/no_such_uuid', 404);
      });
    });

    describe('PATCH /advert/:advert_uuid', function () {
      it('Update Advert', async function () {
        const { data, status } = await axios.patch(
          `/advert/${dummyAdvert.uuid}`,
          updatedAdvert,
          authHeader
        );

        expect(status).to.equal(200);
        for (const key in updatedAdvert) {
          expect(data[key]).to.equal(updatedAdvert[key]);
        }
      });

      it('Access without token', async function () {
        await request(axios.patch, `/advert/${dummyAdvert.uuid}`, 401, updatedAdvert);
      });
      it('Access with invalid token', async function () {
        await requestWithInvalidToken(axios.patch, `/advert/${dummyAdvert.uuid}`, 401, updatedAdvert, {});
      });
      it('Access to unauthorized target', async function () {
        await request(axios.patch, `/advert/${dummyAdvert.uuid}`, 401, updatedAdvert, fakeAuthHeader);
      });
    });

    describe('DELETE /advert/:advert_uuid', function () {
      it('Delete Advert', async function () {
        const { status } = await axios.delete(`/advert/${dummyAdvert.uuid}`, authHeader);

        expect(status).to.equal(204);
      });

      it('Access without token', async function () {
        await request(axios.delete, `/advert/${dummyAdvert.uuid}`, 401);
      });
      it('Access with invalid token', async function () {
        await requestWithInvalidToken(axios.delete, `/advert/${dummyAdvert.uuid}`, 401);
      });
      it('Access to unauthorized target', async function () {
        await request(axios.delete, `/advert/${dummyAdvert.uuid}`, 401, fakeAuthHeader);
      });
    });

  });
}
