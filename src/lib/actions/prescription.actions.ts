'use server';

import { connectDB } from '@/lib/db';
import { Prescription } from '@/models';
import { revalidatePath } from 'next/cache';

export type MedicineInput = {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
};

export type CreatePrescriptionInput = {
    appointmentId: string;
    hospitalId: string;
    doctorId: string;
    patientId: string;
    medicines: MedicineInput[];
    diagnosis: string;
    notes?: string;
};

export type ActionResult<T = null> = {
    success: boolean;
    message: string;
    data?: T;
};

export async function createPrescription(
    input: CreatePrescriptionInput
): Promise<ActionResult<{ id: string }>> {
    try {
        await connectDB();

        const prescription = await Prescription.create(input);
        revalidatePath('/prescriptions');
        revalidatePath('/appointments');

        return {
            success: true,
            message: 'Prescription created successfully',
            data: { id: prescription._id.toString() },
        };
    } catch (error) {
        console.error('Create prescription error:', error);
        return { success: false, message: 'Failed to create prescription' };
    }
}

export async function updatePrescription(
    prescriptionId: string,
    data: Partial<{
        medicines: MedicineInput[];
        diagnosis: string;
        notes: string;
    }>
): Promise<ActionResult> {
    try {
        await connectDB();

        await Prescription.findByIdAndUpdate(prescriptionId, { $set: data });
        revalidatePath('/prescriptions');

        return { success: true, message: 'Prescription updated successfully' };
    } catch (error) {
        console.error('Update prescription error:', error);
        return { success: false, message: 'Failed to update prescription' };
    }
}

export async function getPrescriptionsByHospital(hospitalId: string) {
    try {
        await connectDB();

        const prescriptions = await Prescription.find({ hospitalId })
            .populate('doctorId', 'name specialization')
            .populate('patientId', 'name email phone')
            .sort({ createdAt: -1 })
            .lean();

        return prescriptions.map((p) => ({
            ...p,
            _id: p._id.toString(),
            appointmentId: p.appointmentId.toString(),
            hospitalId: p.hospitalId.toString(),
        }));
    } catch (error) {
        console.error('Get prescriptions error:', error);
        return [];
    }
}

export async function getPrescriptionById(prescriptionId: string) {
    try {
        await connectDB();

        const prescription = await Prescription.findById(prescriptionId)
            .populate('doctorId', 'name specialization')
            .populate('patientId', 'name email phone dateOfBirth gender')
            .populate('appointmentId', 'date timeSlot symptoms')
            .lean();

        if (!prescription) return null;

        return {
            ...prescription,
            _id: prescription._id.toString(),
        };
    } catch (error) {
        console.error('Get prescription error:', error);
        return null;
    }
}

export async function getPrescriptionsByPatient(patientId: string) {
    try {
        await connectDB();

        const prescriptions = await Prescription.find({ patientId })
            .populate('doctorId', 'name specialization')
            .populate('hospitalId', 'name address')
            .sort({ createdAt: -1 })
            .lean();

        return prescriptions.map((p) => ({
            ...p,
            _id: p._id.toString(),
        }));
    } catch (error) {
        console.error('Get patient prescriptions error:', error);
        return [];
    }
}
