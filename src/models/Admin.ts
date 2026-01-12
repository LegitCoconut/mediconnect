import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: 'superadmin' | 'admin';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Admin: Model<IAdmin> =
    mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
