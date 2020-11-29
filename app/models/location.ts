import { ILocation } from '../interfaces/ILocation';
import mongoose from 'mongoose';

const Location = new mongoose.Schema({
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
});

export default mongoose.model<ILocation & mongoose.Document>('Location', Location);