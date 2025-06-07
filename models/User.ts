import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
  failedLoginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;

  isLocked: boolean;

  incrementFailedAttempts(): Promise<void>;
  resetFailedAttempts(): Promise<void>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // ✅ This is sufficient
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Virtual for checking if account is locked
UserSchema.virtual('isLocked').get(function(this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Instance method to increment failed login attempts
UserSchema.methods.incrementFailedAttempts = async function(this: IUser) {
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { failedLoginAttempts: 1 }
    });
  }

  const updates = { $inc: { failedLoginAttempts: 1 } };

  if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
    const lockTime = new Date(Date.now() + 15 * 60 * 1000);
    Object.assign(updates, { $set: { lockUntil: lockTime } });
  }

  return this.updateOne(updates);
};

// Instance method to reset failed login attempts
UserSchema.methods.resetFailedAttempts = async function(this: IUser) {
  return this.updateOne({
    $unset: { failedLoginAttempts: 1, lockUntil: 1 }
  });
};

// Keep only relevant indexes
UserSchema.index({ lockUntil: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
