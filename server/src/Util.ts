require("dotenv").config();
import { sign, verify } from 'jsonwebtoken'
import { bcrypt } from 'bcrypt'
import { RequestHandler } from 'express';



  interface DataCase {
    uuid: string
    user_id:string,
    created_at: Date
  }
  
  export function signToken (TokenMaterial: any, expiresIn: string):string {
    const key:string = process.env.JWT_KEY;
    const option:object = { expiresIn, issuer: "Obbli", subject: "data" };
    const token:string = sign(TokenMaterial, key, option);

    return token;
  }

  export function verifyToken(token: string): any {
    try {
      const target = token.split(' ')[1];
      const key:string = process.env.JWT_KEY;
      const result:DataCase = verify(target, key);
      return result;
    }
    catch {
      return undefined;
    }
  }
  
  export function hashPassword(word):string{
    return bcrypt.hashSync(word, 10);
  } 

export const cookieParser: RequestHandler = function (req, res, next) {
  const cookies: string = req.headers.cookie;
  if (cookies === undefined) { return next(); }
  req.cookies = cookies.split(';').reduce((obj, each) => {
    const [k, v] = each.split('='); obj[k.trim()] = v.trim(); return obj;
  }, {});

  return next();
}
