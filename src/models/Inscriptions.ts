import mongoose, {Schema, model, Document} from "mongoose";
import { ParticipationStatusEnumerator } from "../Enum/ParticipationStatusEnumerator";
import { StatusEnumerator } from "../Enum/StatusEnumerator";

export interface IInscription extends Document {
    userId: mongoose.Types.ObjectId;
    eventId: mongoose.Types.ObjectId;
    forAnotherOne: boolean;
    participants: {
        name: string;
        email: string;
        dateOfBirth: Date;
        document: string;
    },
    status: StatusEnumerator;
    participation_status: ParticipationStatusEnumerator;
    checkin: {
        in: Date;
        out: Date;
    },
    certificate: {
        document: string;
        status: string;
    },
    avaliation: {
        note: number;
        comment: string;
    },
}

const inscriptionSchema = new Schema<IInscription>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        forAnotherOne: { type: Boolean, default: false },
        participants: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            dateOfBirth: { type: Date, required: true },
            document: { type: String, required: true },
        },
        status: { type: String, enum: Object.values(StatusEnumerator), default: StatusEnumerator.PENDING },
        participation_status: { type: String, enum: Object.values(ParticipationStatusEnumerator), default: ParticipationStatusEnumerator.PENDING },
        checkin:{
            in:{type:String},
            out:{type:String}
        },
        certificate:{
            document:{type:String},
            status:{type:String}
        },
        avaliation:{
            note:{type:Number},
            comment:{type:String}
        }
    },
    {
        timestamps:true
    }
);

const InscriptionModel = model<IInscription>("Inscription", inscriptionSchema);
export default InscriptionModel;