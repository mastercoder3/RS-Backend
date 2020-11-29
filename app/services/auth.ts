import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInput } from '../interfaces/IUser';
import { Document, Model } from 'mongoose';

@Service()
export default class AuthService{
    
    constructor(
        @Inject('userModel') private userModel: Model<IUser & Document>,
        @Inject('logger') private logger
    ){}

    public async Signup(userInput: IUserInput): Promise<{user: IUser; token: string} | null>{
        try{
            const salt = randomBytes(32);

            this.logger.silly('Hashing Password');

            const hashedPassword = await argon2.hash(userInput.password, {salt});
            const userRecord  = await this.userModel.create({
                ...userInput,
                salt: salt.toString('hex'),
                password: hashedPassword
            });

            this.logger.silly('Next Step: JWT');

            const token = this.generateToken(userRecord);

            if(!userRecord){
                throw new Error('User cannot be created');
            }

            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');
            return { user, token };
        }
        catch(e){
            this.logger.error(e);
            throw e;
        }

        
    }

    public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string } | null> {
        const userRecord = await this.userModel.findOne({ email });
        if (!userRecord) {
          throw new Error('User not registered');
        }
        const validPassword = await argon2.verify(userRecord.password, password);
        if (validPassword) {
          this.logger.silly('Generating JWT');
          const token = this.generateToken(userRecord);
          const user = userRecord.toObject();
          Reflect.deleteProperty(user, 'password');
          Reflect.deleteProperty(user, 'salt');
          return { user, token };
        } else {
          throw new Error('Invalid Password');
        }
      }

    private generateToken(user){
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
         this.logger.silly(`Signing JWT for userId: ${user._id}`);
        return jwt.sign(
          {
            _id: user._id, 
            exp: exp.getTime() / 1000,
          },
          config.jwtSecret, { algorithm: 'HS256'}
        );
    }

}