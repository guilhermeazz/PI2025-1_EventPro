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
        additionalInfo: string;
    };
    capacity: {
        max: number;
        current: number;
        total: number;
    };
    shcedules: {
        start: Date;
        end: Date;
    };

    type: string | 'standart' | 'class' | 'flash' ;

    inscription: {
        price: number;
        type: string | 'full' | 'half' | 'free' | 'promotional' | 'vip' | 'other';
        discont: number;
    }[];
    certificates: boolean; // Como o certificado não será necessariamente gerado em todos os eventos, poderá se escolher se o evento terá ou não certificado
    certificateTemplate: {
        templateName: string;
        courseName: string;
        courseDescription: string;
    };
    contents: {
        title: string // Devido à falta de infraestrutura para armazenamento de arquivos, o sistema ainda não contemplará esta funcionalidade
    }[];

    entryQrCode: string; // O QrCode de entrada será gerado apenas em eventos flash, onde o participante não precisa se inscrever.

    organizers: {
        userId: mongoose.Types.ObjectId;
        nivel: string | 'admin' | 'reception' | 'speaker' ;
    }[];

    reviews: {
        userId: mongoose.Types.ObjectId;
        rating: number; // De 0 a 5
        comment: string;
    }[];

}

const eventSchema = new Schema<IEvent>(
    {
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
        shcedules: {
            start: { type: Date, required: true },
            end: { type: Date, required: true },
        },
        type: { type: String, enum: ['standart', 'class', 'flash'], required: true },
        inscription: {
            type: [
                {
                    price: { type: Number, required: true },
                    type: { type: String, enum: ['full', 'half', 'free', 'promotional', 'vip', 'other'], required: true },
                    discont: { type: Number, required: true },
                },
            ],
            // Inscriptions são necessárias apenas se o tipo do evento não for flash
            required: function () {
                return this.type !== 'flash';
            },
        },
        certificates: { type: Boolean, required: true },
        certificateTemplate: {
            type: {
                templateName: { type: String, required: true },
                courseName: { type: String, required: true },
                courseDescription: { type: String, required: true },
            },
            // Template de certificado é obrigatório somente se certificates for true
            required: function () {
                return this.certificates === true;
            },
        },
        contents: {
            type: [
                {
                    title: { type: String, required: true },
                },
            ],
            // Conteúdos são opcionais
            required: false,
        },
        entryQrCode: {
            type: String,
            // entryQrCode é obrigatório apenas para eventos do tipo flash
            required: function () {
                return this.type === 'flash';
            },
        },
        organizers: [
            {
                userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
                nivel: { type: String, enum: ['admin', 'reception', 'speaker'], required: true },
            },
        ],
        reviews: [
            {
                userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
            },
        ],
    }
);

// Middleware para inicializar valores padrão em eventos novos
eventSchema.pre<IEvent>('save', function (next) {
    if (this.isNew) {
        this.capacity.current = 0;
        this.capacity.total = 0;
    }
    next();
});

const EventModel = model<IEvent>('Event', eventSchema);
export default EventModel;