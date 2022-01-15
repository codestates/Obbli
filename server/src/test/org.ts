import axios from 'axios';
import { expect } from 'chai';

import dummyData from '../static/dummyData';
import { convert, genAuthHeader, re } from './utils';

const newOrg = {
  user_id: 'testerOrg',
  pw: 'password',
  name: 'testOrg',
};

const updatedOrg = {
  name: 'updatedOrg',
}

const dummyOrg = convert(dummyData.Org)[0];
const authHeader = genAuthHeader(dummyOrg);

export default (server) => {

  describe('Organization membership API', () => {

    it('Get org profile', async () => {
      const { data, status } = await axios.get('/org', authHeader);

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
      const { data, status } = await axios.patch('/org', updatedOrg, authHeader);

      expect(status).to.equal(200);
      for (const key in updatedOrg) {
        expect(data[key]).to.equal(updatedOrg[key]);
      }
    });

    it('Unregister', async () => {
      const { status } = await axios.delete('/org', authHeader);

      expect(status).to.equal(204);
    });

  });

}
