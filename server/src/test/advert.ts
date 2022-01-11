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

function isAdvertList(arr: Object[]): Boolean {
  const _map = {
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

const re = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  token: /^bearer [a-z0-9\-_]*?\.[a-z0-9\-_]*?\.[a-z0-9\-_]*?$/i,
}

const dummyAdvert = convert(dummyData.Advert)[0];
const dummyOrg = convert(dummyData.Org).find(row => row.uuid === dummyAdvert.org_uuid);
const updatedAdvert = {
  body: 'Updated content',
};

export default (server) => {
  describe('Advertisement API', () => {

    it('Get advert list', async () => {
      const { data, status } = await axios.get('/advert');

      expect(status).to.equal(200);
      expect(isAdvertList(data)).to.be.true;
    });

    it('Get Advert content', async () => {
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

    it('Update Advert', async () => {
      const { uuid, user_id, created_at } = dummyOrg;
      const token = signToken({ uuid, user_id, created_at }, '1h');

      const { data, status } = await axios.patch(
        `/advert/${dummyAdvert.uuid}`,
        updatedAdvert,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      expect(status).to.equal(200);
      for (const key in updatedAdvert) {
        expect(data[key]).to.equal(updatedAdvert[key]);
      }
    });

    it('Delete Advert', async () => {
      const { uuid, user_id, created_at } = dummyOrg;
      const token = signToken({ uuid, user_id, created_at }, '1h');

      const { status } = await axios.delete(
        `/advert/${dummyAdvert.uuid}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      expect(status).to.equal(204);
    });

  });
}
