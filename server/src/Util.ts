require("dotenv").config();
import { sign, verify } from 'jsonwebtoken'
import { bcrypt } from 'bcrypt'



  interface DataCase {
    uuid: string
    user_id:string,
    created_at: Date
  }
  
  export function signToken (TokenMaterial:DataCase,expir:string):string {
    const key:string = process.env.JWT_KEY;
    const option:object = { expiresIn: expir, issuer: "Obbli", subject: "data" };
    const token:string = sign(TokenMaterial, key, option);

    return token;
  }

  export function verifyToken(token:string):DataCase{
    const target = token.split(' ')[1]
    const key:string = process.env.JWT_KEY;
    const result:DataCase = verify(target, key);
    return result;
  }
  
  export function hashPassword(word):string{
    return bcrypt.hashSync(word, 10);
  }

