'use server';

import { connectDB } from '@/lib/db';
import { Doctor } from '@/models';
import { revalidatePath } from 'next/cache';

export type CreateDoctorInput = {
    hospitalId: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    qualifications: string[];
    experience: number;
    consultationFee: number;
    avatar?: string;
};

export type ActionResult<T = null> = {
    success: boolean;
    message: string;
    data?: T;
};

export async function createDoctor(
    input: CreateDoctorInput
): Promise<ActionResult<{ id: string }>> {
    try {
        await connectDB();

        const doctor = await Doctor.create({
            ...input,
            schedule: {
                monday: { slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], isAvailable: true },
                tuesday: { slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], isAvailable: true },
                wednesday: { slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], isAvailable: true },
                thursday: { slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], isAvailable: true },
                friday: { slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], isAvailable: true },
                saturday: { slots: ['10:00', '11:00', '12:00'], isAvailable: true },
                sunday: { slots: [], isAvailable: false },
            },
            isActive: true,
        });

        revalidatePath('/doctors');
        return {
            success: true,
            message: 'Doctor added successfully',
            data: { id: doctor._id.toString() },
        };
    } catch (error) {
        console.error('Create doctor error:', error);
        return { success: false, message: 'Failed to add doctor' };
    }
}

export async function updateDoctor(
    doctorId: string,
    data: Partial<CreateDoctorInput & { isActive: boolean; schedule: Record<string, { slots: string[]; isAvailable: boolean }> }>
): Promise<ActionResult> {
    try {
        await connectDB();

        await Doctor.findByIdAndUpdate(doctorId, { $set: data });
        revalidatePath('/doctors');

        return { success: true, message: 'Doctor updated successfully' };
    } catch (error) {
        console.error('Update doctor error:', error);
        return { success: false, message: 'Failed to update doctor' };
    }
}

export async function deleteDoctor(doctorId: string): Promise<ActionResult> {
    try {
        await connectDB();

        await Doctor.findByIdAndDelete(doctorId);
        revalidatePath('/doctors');

        return { success: true, message: 'Doctor removed successfully' };
    } catch (error) {
        console.error('Delete doctor error:', error);
        return { success: false, message: 'Failed to remove doctor' };
    }
}

export async function toggleDoctorStatus(doctorId: string): Promise<ActionResult> {
    try {
        await connectDB();

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return { success: false, message: 'Doctor not found' };
        }

        doctor.isActive = !doctor.isActive;
        await doctor.save();
        revalidatePath('/doctors');

        return {
            success: true,
            message: `Doctor ${doctor.isActive ? 'activated' : 'deactivated'} successfully`,
        };
    } catch (error) {
        console.error('Toggle doctor status error:', error);
        return { success: false, message: 'Failed to update doctor status' };
    }
}

export async function getDoctorsByHospital(hospitalId: string) {
    try {
        await connectDB();

        const doctors = await Doctor.find({ hospitalId })
            .sort({ createdAt: -1 })
            .lean();

        return doctors.map((d) => ({
            ...d,
            _id: d._id.toString(),
            hospitalId: d.hospitalId.toString(),
        }));
    } catch (error) {
        console.error('Get doctors error:', error);
        return [];
    }
}

export async function getDoctorById(doctorId: string) {
    try {
        await connectDB();
        const doctor = await Doctor.findById(doctorId).lean();
        if (!doctor) return null;

        return {
            ...doctor,
            _id: doctor._id.toString(),
            hospitalId: doctor.hospitalId.toString(),
        };
    } catch (error) {
        console.error('Get doctor error:', error);
        return null;
    }
}
