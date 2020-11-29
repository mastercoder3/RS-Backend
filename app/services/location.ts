import { Service, Inject } from 'typedi';
import config from '../config';
import { ILocation, ILocationInput, ILocationSearchInput } from '../interfaces/ILocation';
import mongoose, { Document, Model } from 'mongoose'


@Service()
export default class LocationService {
    constructor(
        @Inject('locationModel') private locationModel: Model<ILocation & Document>,
        @Inject('logger') private logger,
    ) { }

    public async getAllLocations(): Promise<{ Locations: Array<ILocation>; }> {
        try {

            const locationRecords = await this.locationModel.collection.find({});



            if (!locationRecords) {
                throw new Error('No location found!');
            }
            const Locations: Array<ILocation> = [];

            await locationRecords.forEach(function (doc) {
                Locations.push(doc)
            })

            return { Locations };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async addLocation(LocationInput: ILocationInput): Promise<{ Location: ILocation; success: boolean }> {
        try {


            const locationRecord = await this.locationModel.create({
                name: LocationInput.name,
                address: LocationInput.address,
                phone: LocationInput.phone,
                type: LocationInput.type
            })
            if (!locationRecord) {
                throw new Error('Location cannot be created');
            }
            const Location = locationRecord;
            const success = true;
            return { Location, success };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async searchLocation(LocationInput: ILocationSearchInput): Promise<{ Locations: Array<ILocation>; }>{
        try {

            const s = LocationInput.name;
            const regex = new RegExp(s, 'i')
            const locationRecords = await this.locationModel.find({"name" : {$regex : regex}});
            if (!locationRecords) {
                throw new Error('Location cannot be searched.');
            }
            const Locations: Array<ILocation> = [];

            await locationRecords.forEach(function (doc) {
                Locations.push(doc)
            })

            return { Locations };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}