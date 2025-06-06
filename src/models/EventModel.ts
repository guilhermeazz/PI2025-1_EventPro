import mongoose, { Schema, model, Document } from 'mongoose';
export interface IEvent extends Document {
    userId: mongoose.Schema.Types.ObjectId; // Change this to `mongoose.Schema.Types.ObjectId` [cite: 152]

    name: string;
    description: string;
    categories: string[];

    date: Date;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        additionalInfo: string;
    };
    capacity: {
        max: number;
        current: number;
        total: number;
    };
    schedules: {
        start: Date;
        end: Date;
    };

    type: string | 'standart' | 'class' | 'flash'; // [cite: 156]

    inscription: {
        price: number;
        type: string | 'full' | 'half' | 'free' | 'promotional' | 'vip' | 'other'; // [cite: 157]
        discount: number;
    }[];
    certificates: boolean;
    certificateTemplate: {
        templateName: string;
        courseName: string;
        courseDescription: string;
    };
    contents: {
        title: string;
    }[];

    entryQrCode: string;
    organizers: {
        userId: mongoose.Schema.Types.ObjectId; // Change this to `mongoose.Schema.Types.ObjectId` [cite: 161]
        nivel: string | 'admin' | 'reception' | 'speaker';
    }[];

    reviews: {
        userId: mongoose.Schema.Types.ObjectId; // Change this to `mongoose.Schema.Types.ObjectId` [cite: 163]
        rating: number;
        comment: string;
    }[];
}

const eventSchema = new Schema<IEvent>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },
    date: { type: Date, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        additionalInfo: { type: String, required: false },
    },
    capacity: {
        max: { type: Number, required: true },
        current: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    schedules: {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
    },
    type: { type: String, enum: ['standart', 'class', 'flash'], required: true },
    inscription: {
        type: [
            {
                price: { type: Number, required: true },
                type: { type: String, enum: ['full', 'half', 'free', 'promotional', 'vip', 'other'], required: true },
                discount: { type: Number, required: true },
            },
        ],
        required: function (this: any) { // Usar 'this' para acessar 'type'
            return this.type !== 'flash';
        },
    },
    certificates: { type: Boolean, required: true },
    certificateTemplate: {
        templateName: { type: String, required: true },
        courseName: { type: String, required: true },
        courseDescription: { type: String, required: true },
    },
    contents: {
        type: [
            {
                title: { type: String, required: true },
            },
        ],
        required: false,
    },
    entryQrCode: {
        type: String,
        required: function (this: any) { // Usar 'this' para acessar 'type'
            return this.type === 'flash';
        },
    },
    organizers: {
        type: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                nivel: { type: String, enum: ['admin', 'reception', 'speaker'], required: true },
            },
        ],
        required: false,
    },
    reviews: {
        type: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
            },
        ],
        required: false,
    },
});
// Middleware to initialize default values for new events [cite: 173]
eventSchema.pre<IEvent>('save', function (next) {
    if (this.isNew) {
        this.capacity.current = 0;
        this.capacity.total = 0;
    }
    next();
});
const EventModel = model<IEvent>('Event', eventSchema);
export default EventModel;