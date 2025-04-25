import { CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../models/UserModel';

export const hashPassword = async function (this: IUser, next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
};
