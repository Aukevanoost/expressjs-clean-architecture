import { IHashingBoundary } from "@usecases/security";
import bcrypt from "bcrypt";

export class HashingService implements IHashingBoundary {
    private saltRounds = 10;

    hash(passwd: string): Promise<string> {
        return bcrypt.genSalt(this.saltRounds)
            .then(salt => bcrypt.hash(passwd, salt))
    }
    compare(passwd: string, hash: string): Promise<boolean> {
        return bcrypt.compare(passwd, hash);
    }
    

}