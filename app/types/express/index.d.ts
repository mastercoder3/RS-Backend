import mongoose, { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { ILocation } from '../../interfaces/ILocation';
import { IFavorite } from '../../interfaces/IFavorite';

declare global{

    namespace Express {
        export interface Request {
          currentUser: IUser & Document;
        }    
      }
    namespace Models {
        export type UserModel = Model<IUser & Document>;
        export type locationModel = Model<ILocation & Document>;
        export type favoriteModel = Model<IFavorite & Document>;
      }
}