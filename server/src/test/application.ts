import axios from 'axios';
import { expect } from 'chai';

import dummyData from '../static/dummyData';
import { convert, genAuthHeader, re } from './utils';

const dummyPerson = convert(dummyData.Person)[0];
const dummyAdvert = convert(dummyData.Advert)[0];
const dummyOrg = convert(dummyData.Org).find(obj => obj.uuid === dummyAdvert.org_uuid);
const dummyPosition = convert(dummyData.Position).find(obj => obj.advert_uuid === dummyAdvert.uuid);

const personAuthHeader = genAuthHeader(dummyPerson);
const orgAuthHeader = genAuthHeader(dummyOrg);

export default (server) => {
  describe('Application API', () => {

    it('Get a list of applications made by a person', async () => {
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

    it('Make an application to an advert', async () => {
      const { data, status } = await axios.post(
        `/application/${dummyPosition.uuid}`,
        {},
        personAuthHeader
      );

      expect(status).to.equal(201);
      expect(data).to.have.key('created_at');
    });

  });
}
