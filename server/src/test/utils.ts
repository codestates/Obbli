import axios from 'axios';
import { expect } from 'chai';

import { signToken } from '../Util';

const defaultExpected = 400;
const fakeToken = `h)>ot5/4e{._L2(HEmqY@$W^.b{z@`;

// TODO: optional status parameter
export async function request(method: Function, path: string, status: number, ...params: object[]) {
  const { status: actual } = await method(path, ...params);
  expect(actual).to.equal(status);
}

// TODO: something... better than this
export async function requestWithInvalidToken(method: Function, path: string, status: number, ...params: object[]) {
  let target: Record<string, any>;
  if (params.length === 2) { target = params[1]; }
  else if (params.length === 1) { target = params[0]; }
  else { target = {}; params = [target]; }

  if (target.headers === undefined) { target.headers = {}; }
  target.headers.Authorization = fakeToken;

  await request(method, path, status, ...params);
}

export const re = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  token: /^bearer [a-z0-9\-_]*?\.[a-z0-9\-_]*?\.[a-z0-9\-_]*?$/i,
}

export function convert(entity) {
  return entity.rows.map((item) => {
    return Object.fromEntries(item.map((v, i) => [entity.columns[i], v]));
  });
}

export function genAuthHeader(obj) {
  const { uuid, user_id, created_at } = obj;
  const token = signToken({ uuid, user_id, created_at }, '1h');
  return { headers: { Authorization: `Bearer ${token}` } };
}
