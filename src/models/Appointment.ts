import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
    _id: mongoose.Types.ObjectId;
    hospitalId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    date: Date;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    symptoms?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
        patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        timeSlot: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        symptoms: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

// Indexes for efficient querying
AppointmentSchema.index({ hospitalId: 1, date: 1 });
AppointmentSchema.index({ doctorId: 1, date: 1 });
AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ status: 1 });

export const Appointment: Model<IAppointment> =
    mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
