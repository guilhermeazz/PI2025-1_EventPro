import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  lastname: string;
  password: string;
  dateOfBirth: Date;
  cpf: string;
  phone: string;
  email: string;
  eventsInscriptions: {
    eventId: mongoose.Types.ObjectId;
    inscriptionId: mongoose.Types.ObjectId;
  }[];
  eventsParticipations: {
    eventId: mongoose.Types.ObjectId;
    participationId: mongoose.Types.ObjectId;
  }[];
  tickets: {
    eventId: mongoose.Types.ObjectId;
    inscriptionId: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function (value: string) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
        },
        message: 'A senha deve conter ao menos 8 caracteres, incluindo letras e números.',
      },
    },
    dateOfBirth: { type: Date, required: true },
    cpf: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    eventsInscriptions: [
      {
        eventId: { type: mongoose.Types.ObjectId, ref: 'Event', required: true },
        inscriptionId: { type: mongoose.Types.ObjectId, ref: 'Inscription', required: true },
      },
    ],
    eventsParticipations: [
      {
        eventId: { type: mongoose.Types.ObjectId, ref: 'Event', required: true },
        participationId: { type: mongoose.Types.ObjectId, ref: 'Participation', required: true },
      },
    ],
    tickets: [
      {
        eventId: { type: mongoose.Types.ObjectId, ref: 'Event', required: true },
        inscriptionId: { type: mongoose.Types.ObjectId, ref: 'Inscription', required: true },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as any);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model<IUser>('User', userSchema);
export default UserModel;
