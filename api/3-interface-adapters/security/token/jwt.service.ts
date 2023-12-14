import { AuthenticationError } from "util/errors/authentication.error";
import { IJWTBoundary, IJWTBoundaryInput, IJWTBoundaryOutput } from "@usecases/security";
import jwt from "jsonwebtoken";
import Environment from "util/environment";
import crypto from "crypto";

export class JWTService implements IJWTBoundary {
  private static TOKEN = Environment.get('JWT_PRIVATE_KEY').orThrow("PRIVATE KEY CANNOT BE EMPTY");
  private static ISSUER = 'https://spaghett.io';

  generateAccessToken(identity: { user: string; email: string; }): Promise<IJWTBoundaryOutput> {
    return this.generate({...identity, type: 'access_token', duration: 1800})//1800 
  }

  generateRefreshToken(identity: { user: string; email: string; }): Promise<IJWTBoundaryOutput> {
    return this.generate({...identity, type: 'refresh_token', duration: 3600}) //3600
  }

  private generate(props: IJWTBoundaryInput): Promise<IJWTBoundaryOutput> {
    return new Promise((resolve, reject) => {

      try{
        const token = jwt.sign({...props, id: crypto.randomUUID()}, JWTService.TOKEN, { expiresIn: props.duration, issuer: JWTService.ISSUER});
        const meta = jwt.decode(token) as string | null | {exp: number, iat: number, iss: string, id: string };

        if(typeof meta === "string") throw new Error(`Invalid JWT Token created: '${jwt}'`)
        if(meta === null) throw new Error(`Could not generate JWT Token`);
        
        return resolve({ token, body: {
          ...props,
          expires: meta.exp,
          issued: meta.iat,
          id: meta.id,
          issuer: meta.iss
        }});
      }catch(e) {
        console.error(e);
        return reject(new AuthenticationError("Could not create token"))
      }   
    }); 
  }

  verify(token?: string, props?: Partial<IJWTBoundaryInput>): Promise<IJWTBoundaryOutput> {  
    return new Promise((resolve, reject) => {
      try {
        if(!token) return reject(new AuthenticationError("No bearer token provided"));
        const body = jwt.verify(token, JWTService.TOKEN as string, {issuer: JWTService.ISSUER});

        if(typeof body === 'string') return reject(new AuthenticationError(body));
        
        if(!!props) {
          Object.entries(props).forEach(([prop, expectedValue]) => {
            if(!body[prop] || body[prop] !== expectedValue) {
              console.error(`Invalid JWT Token:  '${prop}' property '${body[prop]}' and '${expectedValue}' are not equal!`);
              reject(reject(new AuthenticationError("Invalid token")))
            }
          })
        }

        return resolve({ 
          token,
          body: {
            id: body.id,
            type: body.type,
            issuer: body.iss ?? '',  
            issued: body.iat ?? -1,
            expires: body.exp ?? -1,
            email: body.email,
            user: body.user
          }
        });
      }catch(err: any) {
        if(err?.expiredAt)  return reject(new AuthenticationError('Token expired'));
        
        console.error(err);
        return reject(new AuthenticationError('Invalid token'));
      }
    });

  }
  public isExpired(expires: number): boolean {
    return (Date.now() >= expires * 1000);
  }
}