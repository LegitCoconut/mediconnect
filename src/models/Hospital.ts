import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHospital extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        lat?: number;
        lng?: number;
    };
    logo?: string;
    images: string[];
    operatingHours: {
        [key: string]: { open: string; close: string; isClosed: boolean };
    };
    departments: string[];
    description?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            pincode: { type: String, default: '' },
            lat: { type: Number },
            lng: { type: Number },
        },
        logo: { type: String },
        images: [{ type: String }],
        operatingHours: {
            type: Map,
            of: new Schema({
                open: { type: String, default: '09:00' },
                close: { type: String, default: '18:00' },
                isClosed: { type: Boolean, default: false },
            }),
            default: {},
        },
        departments: [{ type: String }],
        description: { type: String },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Hospital: Model<IHospital> =
    mongoose.models.Hospital || mongoose.model<IHospital>('Hospital', HospitalSchema);
