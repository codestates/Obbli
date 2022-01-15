import { signToken } from '../Util';

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
