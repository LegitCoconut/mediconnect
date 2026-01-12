import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    password: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    bloodGroup?: string;
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
    // Medical History
    medicalHistory?: {
        allergies: string[];
        chronicConditions: string[];
        currentMedications: string[];
        pastSurgeries: string[];
        familyHistory: string[];
    };
    height?: number; // in cm
    weight?: number; // in kg
    profileImage?: string;
    isOnboardingComplete: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        bloodGroup: { type: String },
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
        medicalHistory: {
            allergies: [{ type: String }],
            chronicConditions: [{ type: String }],
            currentMedications: [{ type: String }],
            pastSurgeries: [{ type: String }],
            familyHistory: [{ type: String }],
        },
        height: { type: Number },
        weight: { type: Number },
        profileImage: { type: String },
        isOnboardingComplete: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
