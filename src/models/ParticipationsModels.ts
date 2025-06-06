import mongoose, {Schema, model, Document } from "mongoose";
import { ParticipationStatusEnumerator } from "../Enum/ParticipationStatusEnumerator";

export interface IParticipation extends Document {
    userId: mongoose.Types.ObjectId; // Tornar obrigatório
    eventId: mongoose.Types.ObjectId; // Tornar obrigatório
    name: string;
    email: string;
    dateOfBirth: Date;
    document: string;
    status: ParticipationStatusEnumerator; // Adicionar status
    checkin?: { // Adicionado
        in?: Date;
        out?: Date;
    };
    avaliation: {
        note: number;
        comment: string;
    }
}

const participtionSchema = new Schema<IParticipation>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true},
    email: { type: String, required: true},
    dateOfBirth: { type: Date, required: true},
    document: { type: String, required: true},
    status: { type: String, enum: Object.values(ParticipationStatusEnumerator), default: ParticipationStatusEnumerator.PENDING },
    checkin: { // Adicionado
        in: { type: Date },
        out: { type: Date }
    },
    avaliation: {
        note: { type: Number, required: true},
        comment: { type: String, required: true}
    }},
    {timestamps: true}
)

const ParticipationModel = model<IParticipation>("Participation", participtionSchema)
export default ParticipationModel;