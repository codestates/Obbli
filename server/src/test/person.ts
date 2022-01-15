import axios from 'axios';
import { expect } from 'chai';

import dummyData from '../static/dummyData';
import { convert, genAuthHeader, re } from './utils';

const newUser = {
  user_id: 'tester',
  pw: 'password',
  name: 'testuser',
};
const dummyUser = convert(dummyData.Person)[0];
const authHeader = genAuthHeader(dummyUser);

export default (server) => {

  describe('Person membership API', () => {

    it('Get person profile', async () => {
      const { data, status } = await axios.get('/person', authHeader);
      expect(status).to.equal(200);
      expect(data).to.have.keys(['realname', 'professional', 'skill', 'history']);
    })

    it('Sign up', async () => {
      const { data, status } = await axios.post('/person', { ...newUser, pw_check: newUser.pw });
      expect(status).to.equal(201);
      expect(data).to.have.property('access_token').and.match(re.token);
      // TODO: change order with Sign-in to check if the data is inserted into DB
    });

    it('Sign in', async () => {
      // TODO: what if extra properties are in payload?
      const { user_id, pw_hash: pw } = dummyUser;
      const { data, status } = await axios.post('/person/sign-in', { user_id, pw });
      expect(status).to.equal(200);
      expect(data).to.have.property('access_token').and.match(re.token);
    });

    it('Update profile', async () => {
      const newProfile = {
        name: 'updatedName',
        skill: '플룻',
      }
      const { data, status } = await axios.patch('/person', newProfile, authHeader);

      expect(status).to.equal(200);
      expect(data).to.have.keys(['name', 'professional', 'skill', 'history']);
      for (const key in newProfile) {
        expect(data[key]).to.equal(newProfile[key]);
      }
      // TODO: check type of each property
    })

    it('Unregister', async () => {
      const { status } = await axios.delete('/person', authHeader);

      expect(status).to.equal(204);
      // TODO: check if data is deleted from DB
    });

  });
}
