import axios from 'axios';
import { expect } from 'chai';

import dummyData from '../static/dummyData';
import { convert, genAuthHeader } from './utils';

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

const dummyAdvert = convert(dummyData.Advert)[0];
const dummyOrg = convert(dummyData.Org).find(row => row.uuid === dummyAdvert.org_uuid);
const updatedAdvert = {
  body: 'Updated content',
};
const authHeader = genAuthHeader(dummyOrg);

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

    it('Delete Advert', async () => {
      const { status } = await axios.delete(`/advert/${dummyAdvert.uuid}`, authHeader);

      expect(status).to.equal(204);
    });

  });
}
