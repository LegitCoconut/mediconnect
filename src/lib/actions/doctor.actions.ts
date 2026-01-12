'use server';

import { connectDB } from '@/lib/db';
import { Doctor } from '@/models';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export type CreateDoctorInput = {
    hospitalId: string;
    departmentId: string;
    name: string;
    email: string;
    password: string;
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

        // Check if email already exists
        const existing = await Doctor.findOne({ email: input.email });
        if (existing) {
            return { success: false, message: 'Email already registered' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        const doctor = await Doctor.create({
            ...input,
            password: hashedPassword,
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
    data: Partial<Omit<CreateDoctorInput, 'password'> & {
        isActive: boolean;
        schedule: Record<string, { slots: string[]; isAvailable: boolean }>
    }>
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

export async function updateDoctorPassword(
    doctorId: string,
    newPassword: string
): Promise<ActionResult> {
    try {
        await connectDB();

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await Doctor.findByIdAndUpdate(doctorId, { password: hashedPassword });

        return { success: true, message: 'Password updated successfully' };
    } catch (error) {
        console.error('Update password error:', error);
        return { success: false, message: 'Failed to update password' };
    }
}

export async function updateDoctorSchedule(
    doctorId: string,
    schedule: Record<string, { slots: string[]; isAvailable: boolean }>
): Promise<ActionResult> {
    try {
        await connectDB();

        await Doctor.findByIdAndUpdate(doctorId, { schedule });
        revalidatePath('/doctors');

        return { success: true, message: 'Schedule updated successfully' };
    } catch (error) {
        console.error('Update schedule error:', error);
        return { success: false, message: 'Failed to update schedule' };
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
            .populate('departmentId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        return doctors.map((d) => ({
            ...d,
            _id: d._id.toString(),
            hospitalId: d.hospitalId.toString(),
            departmentId: typeof d.departmentId === 'object'
                ? { id: (d.departmentId as { _id: { toString: () => string }; name: string })._id.toString(), name: (d.departmentId as { name: string }).name }
                : d.departmentId.toString(),
            password: undefined, // Don't expose password
        }));
    } catch (error) {
        console.error('Get doctors error:', error);
        return [];
    }
}

export async function getDoctorsByDepartment(departmentId: string) {
    try {
        await connectDB();

        const doctors = await Doctor.find({ departmentId, isActive: true })
            .select('-password')
            .sort({ name: 1 })
            .lean();

        return doctors.map((d) => ({
            ...d,
            _id: d._id.toString(),
            hospitalId: d.hospitalId.toString(),
            departmentId: d.departmentId.toString(),
        }));
    } catch (error) {
        console.error('Get doctors by department error:', error);
        return [];
    }
}

export async function getDoctorById(doctorId: string) {
    try {
        await connectDB();
        const doctor = await Doctor.findById(doctorId)
            .populate('departmentId', 'name')
            .populate('hospitalId', 'name')
            .lean();
        if (!doctor) return null;

        return {
            ...doctor,
            _id: doctor._id.toString(),
            hospitalId: typeof doctor.hospitalId === 'object'
                ? { id: (doctor.hospitalId as { _id: { toString: () => string }; name: string })._id.toString(), name: (doctor.hospitalId as { name: string }).name }
                : doctor.hospitalId.toString(),
            departmentId: typeof doctor.departmentId === 'object'
                ? { id: (doctor.departmentId as { _id: { toString: () => string }; name: string })._id.toString(), name: (doctor.departmentId as { name: string }).name }
                : doctor.departmentId.toString(),
            password: undefined,
        };
    } catch (error) {
        console.error('Get doctor error:', error);
        return null;
    }
}
