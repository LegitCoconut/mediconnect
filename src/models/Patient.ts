import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPatient extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    emergencyContact?: {
        name: string;
        phone: string;
        relation: string;
    };
    firebaseUid?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
        },
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
            relation: { type: String },
        },
        firebaseUid: { type: String },
    },
    { timestamps: true }
);

export const Patient: Model<IPatient> =
    mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
