import { Person, Org } from '../entity';
import { signToken, verifyToken } from '../Util';

const map = { 'person': Person, 'org': Org };

// TODO: integrate with sign-in controller
// TODO: refresh token rotation
export async function refreshToken(req, res) {
  return res.status(401).send();
  if (!req.cookies) { return res.status(401).send(); }

  const { refresh_token } = req.cookies;
  if (!refresh_token) { return res.status(401).send(); }

  let data;
  try { data = verifyToken(res.cookies.refresh_token) }
  catch { res.status(401).send(); }

  res.cookie(
    'refresh_token',
    signToken(data, '1d'),
    { expires: 0 }, // session cookie
  );

  return res.status(200).send({
    access_token: signToken(data, '1h'),
    token_type: 'Bearer',
    expires_in: 3600, // 1h
    uuid: data.uuid,
    permission: data.permission,
  });
};

export function signOut(req, res) {
  res.clearCookie(
    'refreshToken',
    { httpOnly: true },
  );
  return res.status(204).send();
}
