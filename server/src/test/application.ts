import axios from 'axios';
import { expect } from 'chai';

import dummyData from '../static/dummyData';
import { signToken } from '../Util';

// // TODO: move `convert()` to utils module
function convert(entity) {
  return entity.rows.map((item) => {
    return Object.fromEntries(item.map((v, i) => [entity.columns[i], v]));
  });
}

const re = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  token: /^bearer [a-z0-9\-_]*?\.[a-z0-9\-_]*?\.[a-z0-9\-_]*?$/i,
}

const dummyUser = convert(dummyData.Person)[0];
const dummyAdvert = convert(dummyData.Advert)[0];
const dummyOrg = convert(dummyData.Org).find(obj => obj.uuid === dummyAdvert.org_uuid);
const dummyPosition = convert(dummyData.Position).find(obj => obj.advert_uuid === dummyAdvert.uuid);

export default (server) => {
  describe('Application API', () => {

    it('Get a list of applications made by a person', async () => {
      const { uuid, user_id, created_at } = dummyUser;
      const token = signToken({ uuid, user_id, created_at }, '1h');

      const { data, status } = await axios.get(
        `/person/application`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
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

    it('Get a list of applications made to an advert', async () => {
      const { uuid, user_id, created_at } = dummyOrg;
      const token = signToken({ uuid, user_id, created_at }, '1h');

      const { data, status } = await axios.get(
        `/advert/${dummyAdvert.uuid}/application`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      expect(status).to.equal(200);
      expect(data).to.be.an('array');
      for (const obj of data) {
        expect(obj).to.be.an('object');
        expect(obj).to.have.keys([
          'person_uuid',
          'person_name',
          'skill_name',
          'professional',
        ]);
      }
    });

    it('Make an application to an advert', async () => {
      const { uuid, user_id, created_at } = dummyUser;
      const token = signToken({ uuid, user_id, created_at }, '1h');

      const { data, status } = await axios.post(
        `/application/${dummyPosition.uuid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      expect(status).to.equal(201);
      expect(data).to.have.key('created_at');
    });

  });
}
