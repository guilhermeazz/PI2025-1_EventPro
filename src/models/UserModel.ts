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

  // Campos de verificação e reset de senha permanecem, mas a lógica de uso muda
  emailVerified: boolean; // Este será sempre true para usuários criados por este novo fluxo
  verificationCode?: string; // Usado para gerar e validar o token temporário
  verificationCodeExpires?: Date;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true }, // ✅ Revertido para obrigatório
    lastname: { type: String, required: true }, // ✅ Revertido para obrigatório
    password: {
      type: String,
      required: true, // ✅ Revertido para obrigatório
      minlength: 8,
      validate: {
        validator: function (value: string) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&_]{8,}$/.test(value);
        },
        message: 'A senha deve conter ao menos 8 caracteres, incluindo letras, números e caracteres especiais.',
      },
    },
    dateOfBirth: { type: Date, required: true }, // ✅ Revertido para obrigatório
    cpf: { type: String, required: true, unique: true }, // ✅ Revertido para obrigatório
    phone: { type: String, required: true }, // ✅ Revertido para obrigatório
    email: { type: String, required: true, unique: true },

    emailVerified: { type: Boolean, default: true }, // ✅ Default para true neste novo fluxo
    verificationCode: { type: String, required: false }, // Usado apenas temporariamente, não persistente
    verificationCodeExpires: { type: Date, required: false }, // Usado apenas temporariamente, não persistente

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as any);
  }
});
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model<IUser>('User', userSchema);
export default UserModel;