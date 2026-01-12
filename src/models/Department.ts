import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDepartment extends Document {
    _id: mongoose.Types.ObjectId;
    hospitalId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        name: { type: String, required: true },
        description: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Compound index for unique department names per hospital
DepartmentSchema.index({ hospitalId: 1, name: 1 }, { unique: true });

export const Department: Model<IDepartment> =
    mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
