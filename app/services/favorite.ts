import { Service, Inject } from 'typedi';
import config from '../config';
import { IFavorite, IFavoriteUserInput, IFavoriteExistInput } from '../interfaces/IFavorite';
import mongoose, { Document, Model } from 'mongoose'
import { ObjectId } from 'mongodb';


@Service()
export default class FavoriteService {
    constructor(
        @Inject('favoriteModel') private favoriteModel: Model<IFavorite & Document>,
        @Inject('logger') private logger,
    ) { }

    public async getAllUserFavorites(FavoriteInput: IFavoriteUserInput): Promise<{ Favorite: Array<IFavorite>; }> {
        try {

            const favoritesRecord = await this.favoriteModel.collection.find({ userId: FavoriteInput.userId as String });


            if (!favoritesRecord) {
                throw new Error('No Favorite location found!');
            }
            const Favorite: Array<IFavorite> = [];

            await favoritesRecord.forEach(function (doc) {
                Favorite.push(doc)
            })

            // console.log(Favorite);
            return { Favorite };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async checkIfExists(FavoriteInput: IFavoriteExistInput): Promise<{ exists: boolean }> {
        try {

            const favoriteExists = await this.favoriteModel.collection.findOne({ userId: FavoriteInput.userId, locationId: FavoriteInput.locationId });

            if (!favoriteExists) {
                const exists = false;
                return { exists };
                // throw new Error('No Favorite location found!');
            }

            const exists = true;
            return { exists };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async addFavorite(FavoriteInput: IFavorite): Promise<{ Favorite: IFavorite; success: boolean }> {
        try {

            const favoriteExists = await this.favoriteModel.findOne({ userId: FavoriteInput.userId, locationId: FavoriteInput.locationId });

            if (favoriteExists) {
                const Favorite = favoriteExists;
                const success = false;
                return { Favorite, success };
            }
            else {
                const favoriteRecord = await this.favoriteModel.create({
                    name: FavoriteInput.name,
                    address: FavoriteInput.address,
                    phone: FavoriteInput.phone,
                    type: FavoriteInput.type,
                    userId: FavoriteInput.userId,
                    locationId: FavoriteInput.locationId
                })
                if (!favoriteRecord) {
                    throw new Error('Location cannot be created');
                }
                const Favorite = favoriteRecord;
                const success = true;
                return { Favorite, success };
            }
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async deleteFavorite(favoriteId: mongoose.Schema.Types.ObjectId): Promise<{ success: boolean }> {
        try {
            const favoriteRecord = await this.favoriteModel.findOneAndRemove({ "_id": favoriteId });

            return { success: true }

        } catch (e) {
            this.logger.error(e);
            throw e;

        }
    }

}