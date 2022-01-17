import axios from 'axios';
import { expect } from 'chai';

import dummyData from '../static/dummyData';
import { convert, genAuthHeader, re } from './utils';

const dummyPerson = convert(dummyData.Person)[0];
const dummyAdvert = convert(dummyData.Advert)[1];
const dummyOrg = convert(dummyData.Org)[1];
const newReview = { comment: 'new review', rating: 4 };
const updatedReview = { comment: 'updated review', rating: 3 };

const personAuthHeader = genAuthHeader(dummyPerson);
const orgAuthHeader = genAuthHeader(dummyOrg);

// TODO: reduce duplicate code
// TODO: add test for failure scenarios
// TODO: consider idempotency for POST requests (201 only when created)

export default (server) => {
  describe('Advertisement API', async () => {

    it('POST /person/review/:person_uuid', async () => {
      const { data, status } = await axios.post(
        `/person/review/${dummyPerson.uuid}`,
        newReview,
        orgAuthHeader,
      );

      expect(status).to.equal(201);
      expect(data).to.have.keys(['comment', 'rating']);
      for (const key in data) {
        expect(data[key]).to.equal(newReview[key]);
      }
    });

    it('GET /person/review/:person_uuid', async () => {
      const { data, status } = await axios.get(
        `/person/review/${dummyPerson.uuid}`,
        personAuthHeader,
      );

      expect(status).to.equal(200);
      expect(data).to.be.an('array');
      for (const review of data) {
        expect(review).to.be.an('object');
        expect(review).to.have.keys(['comment', 'rating']);
      }
    });

    it('PATCH /person/review/:person_uuid', async () => {
      const { data, status } = await axios.patch(
        `/person/review/${dummyPerson.uuid}`,
        updatedReview,
        orgAuthHeader,
      );

      expect(status).to.equal(200);
      expect(data).to.have.keys(['comment', 'rating']);
      for (const key in data) {
        expect(data[key]).to.equal(updatedReview[key]);
      }
    });

    it('DELETE /person/review/:person_uuid', async () => {
      const { status } = await axios.delete(
        `/person/review/${dummyPerson.uuid}`,
        orgAuthHeader,
      );

      expect(status).to.equal(204);
    });

    it('POST /org/review/:org_uuid', async () => {
      const { data, status } = await axios.post(
        `/org/review/${dummyOrg.uuid}`,
        newReview,
        personAuthHeader,
      );

      expect(status).to.equal(201);
      expect(data).to.have.keys(['comment', 'rating']);
      for (const key in data) {
        expect(data[key]).to.equal(newReview[key]);
      }
    });

    it('GET /org/review/:org_uuid', async () => {
      const { data, status } = await axios.get(
        `/org/review/${dummyOrg.uuid}`,
        orgAuthHeader,
      );

      expect(status).to.equal(200);
      expect(data).to.be.an('array');
      for (const review of data) {
        expect(review).to.be.an('object');
        expect(review).to.have.keys(['comment', 'rating']);
      }
    });

    it('PATCH /org/review/:org_uuid', async () => {
      const { data, status } = await axios.patch(
        `/org/review/${dummyOrg.uuid}`,
        updatedReview,
        personAuthHeader,
      );

      expect(status).to.equal(200);
      expect(data).to.have.keys(['comment', 'rating']);
      for (const key in data) {
        expect(data[key]).to.equal(updatedReview[key]);
      }
    });

    it('DELETE /org/review/:org_uuid', async () => {

      const { status } = await axios.delete(
        `/org/review/${dummyOrg.uuid}`,
        personAuthHeader,
      );

      expect(status).to.equal(204);
    });

  });
}
