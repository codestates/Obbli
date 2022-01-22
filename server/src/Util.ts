require("dotenv").config();
import { sign, verify } from 'jsonwebtoken'
import { bcrypt } from 'bcrypt'
import { RequestHandler } from 'express';

import multer  from 'multer'
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'


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


aws.config.loadFromPath(__dirname + '/s3multer.json');
const s3 = new aws.S3();
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_MULTER_NAME,
        acl: 'public-read',
        key: (req, file, cb) => { 
        const uuid =  verifyToken(req.headers.authorization).uuid
         cb(null,uuid)
      }
    })
});

export const uploadImage = async (req, res) => {

  console.log(req.file)
  if(!req.file){
    return res.status(400).send()
  }
  else{
    return res.status(200).json({})
  }
}