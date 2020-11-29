import { IFavorite } from '../interfaces/IFavorite';
import mongoose from 'mongoose';

const Favorite = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide location name"],
        index: true
    },
    address: {
        type: String,
        required: [true, "Please provide location address"],
        index: true
    },
    phone:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    locationId: {
        type: String,
        required: true
    }
});

export default mongoose.model<IFavorite & mongoose.Document>('Favorite', Favorite);