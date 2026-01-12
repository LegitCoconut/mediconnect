import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedicine {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

export interface IPrescription extends Document {
    _id: mongoose.Types.ObjectId;
    appointmentId: mongoose.Types.ObjectId;
    hospitalId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    medicines: IMedicine[];
    diagnosis: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String },
});

const PrescriptionSchema = new Schema<IPrescription>(
    {
        appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
        patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
        medicines: [MedicineSchema],
        diagnosis: { type: String, required: true },
        notes: { type: String },
    },
    { timestamps: true }
);

PrescriptionSchema.index({ patientId: 1 });
PrescriptionSchema.index({ doctorId: 1 });
PrescriptionSchema.index({ appointmentId: 1 });

export const Prescription: Model<IPrescription> =
    mongoose.models.Prescription || mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
