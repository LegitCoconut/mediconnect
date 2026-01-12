import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
    _id: mongoose.Types.ObjectId;
    hospitalId: mongoose.Types.ObjectId;
    name: string;
    department: string;
    description?: string;
    price: number;
    duration: number; // in minutes
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        name: { type: String, required: true },
        department: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        duration: { type: Number, default: 30 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ServiceSchema.index({ hospitalId: 1 });
ServiceSchema.index({ department: 1 });

export const Service: Model<IService> =
    mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
