import mongoose, { Schema, model, Document } from 'mongoose';   

export interface IEvent extends Document {
    userId: mongoose.Types.ObjectId;

    name: string;
    description: string;
    categories: string[];

    date: Date;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
    };
    capacity: {
        max: number;
        current: number;
        total: number;
    };
    shcedules: {
        start: Date;
        end: Date;
    }
}
