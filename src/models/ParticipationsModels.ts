import mongoose, {Schema, model, Document } from "mongoose";

export interface IParticipation extends Document {
    userId?: mongoose.Types.ObjectId;
    eventId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    dateOfBirth: Date;
    document: string;
    avaliation: {
        note: number;
        comment: string;
    }
}

const participtionSchema = new Schema<IParticipation>({
    name: { type: String, required: true},
    email: { type: String, required: true},
    dateOfBirth: { type: Date, required: true},
    document: { type: String, required: true},
    avaliation: {
        note: { type: Number, required: true},
        comment: { type: String, required: true}
    }},
    {timestamps: true}
)

const ParticipationModel = model<IParticipation>("Participation", participtionSchema)
export default ParticipationModel;