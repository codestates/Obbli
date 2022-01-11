import axios from 'axios';
import { expect } from 'chai';

import dummyData from '../static/dummyData';
import { signToken } from '../Util';

// TODO: move `convert()` to utils module
function convert(entity) {
  return entity.rows.map((item) => {
    return Object.fromEntries(item.map((v, i) => [entity.columns[i], v]));
  });
}

const re = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  token: /^bearer [a-z0-9\-_]*?\.[a-z0-9\-_]*?\.[a-z0-9\-_]*?$/i,
}

const newOrg = {
  user_id: 'testerOrg',
  pw: 'password',
  name: 'testOrg',
};

const updatedOrg = {
  name: 'updatedOrg',
}

const dummyOrg = convert(dummyData.Org)[0];

export default (server) => {

  describe('Organization membership API', () => {

    it('Get org profile', async () => {
      const { uuid, user_id, created_at } = dummyOrg;
      const token = signToken({ uuid, user_id, created_at }, '1h');

      const { data, status } = await axios.get(
        '/org',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      expect(status).to.equal(200);
      expect(data).to.have.keys(['description', 'headcount', 'name', 'since']);
      for (const key in data) {
        const source = dummyOrg[key];
        expect(data[key]).to.equal(source instanceof Date ? source.toISOString() : source);
      }
    });

    it('Sign up', async () => {
      const { data, status } = await axios.post('/org', { ...newOrg, pw_check: newOrg });
      expect(status).to.equal(201);
      expect(data).to.have.property('access_token');
    });

    it('Sign in', async () => {
      const { user_id, pw_hash: pw } = dummyOrg;

      const { data, status } = await axios.post('/org/sign-in', { user_id, pw });
      expect(status).to.equal(200);
      expect(data).to.have.property('access_token');
    })

    it('Update profile', async () => {
      const { uuid, user_id, created_at } = dummyOrg;
      const token = signToken({ uuid, user_id, created_at }, '1h');

      const { data, status } = await axios.patch(
        '/org',
        updatedOrg,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      expect(status).to.equal(200);
      for (const key in updatedOrg) {
        expect(data[key]).to.equal(updatedOrg[key]);
      }
    });

    it('Unregister', async () => {
      const { uuid, user_id, created_at } = dummyOrg;
      const token = signToken({ uuid, user_id, created_at }, '1h');

      const { status } = await axios.delete('/org', { headers: { Authorization: `Bearer ${token}` } });
      expect(status).to.equal(204);
    });

  });

}
