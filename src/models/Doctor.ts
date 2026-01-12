import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDoctor extends Document {
    _id: mongoose.Types.ObjectId;
    hospitalId: mongoose.Types.ObjectId;
    departmentId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone: string;
    specialization: string;
    qualifications: string[];
    experience: number;
    consultationFee: number;
    avatar?: string;
    schedule: {
        [key: string]: { slots: string[]; isAvailable: boolean };
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        specialization: { type: String, required: true },
        qualifications: [{ type: String }],
        experience: { type: Number, default: 0 },
        consultationFee: { type: Number, required: true },
        avatar: { type: String },
        schedule: {
            type: Map,
            of: new Schema({
                slots: [{ type: String }],
                isAvailable: { type: Boolean, default: true },
            }),
            default: {},
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Doctor: Model<IDoctor> =
    mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
