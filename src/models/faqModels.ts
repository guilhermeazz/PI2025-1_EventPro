import {Schema, model, Document} from "mongoose";

export interface IFaq extends Document {
    question: string;
    answer: string;
}

const faqSchema = new Schema<IFaq>(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
    },
    {
        timestamps:true
    }
);

const FaqModel = model<IFaq>("Faq", faqSchema);
export default FaqModel;

